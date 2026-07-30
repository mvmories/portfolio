/**
 * A WebGL point cloud that resolves into a portrait and scatters away from the
 * pointer.
 *
 * Written against raw WebGL2 rather than Three.js on purpose: this is a single
 * effect with one draw call, and Three would add roughly 160 kB gzipped to a
 * site whose whole point is that it loads fast. What is here is about 5 kB.
 *
 * The module is deliberately framework-free - it owns a canvas and nothing
 * else - so the React wrapper stays a thin lifecycle shim and the sampling
 * logic can be tested without a GL context.
 */

export interface Palette {
  /** Colour of the darkest parts of the portrait. */
  dark: [number, number, number]
  /** Colour of the brightest parts. */
  light: [number, number, number]
  /** Tint applied to points pushed by the pointer. */
  accent: [number, number, number]
}

export interface SampleResult {
  /** Four floats per point: x, y in [-1, 1], luminance in [0, 1], seed. */
  data: Float32Array
  count: number
  /** Points across the widest row, used to derive a point size. */
  columns: number
  aspect: number
}

/**
 * Turns an image into points, one per sampled pixel that is opaque enough to
 * be part of the subject.
 *
 * Transparent pixels are dropped rather than drawn at zero alpha, which is what
 * makes the silhouette clean and keeps the buffer roughly 40% smaller.
 */
export function samplePoints(
  image: ImageData,
  step: number,
  alphaThreshold = 0.35,
): SampleResult {
  const { width, height, data: px } = image
  const values: number[] = []
  const minAlpha = alphaThreshold * 255

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const i = (y * width + x) * 4
      if (px[i + 3] < minAlpha) continue

      // Rec. 709 luma: matches how the eye weights the channels, so the point
      // cloud keeps the tonal structure of the face rather than flattening it.
      const lum = (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255

      values.push(
        (x / width) * 2 - 1,
        1 - (y / height) * 2,
        lum,
        Math.random(),
      )
    }
  }

  return {
    data: new Float32Array(values),
    count: values.length / 4,
    columns: Math.ceil(width / step),
    aspect: width / height,
  }
}

const VERTEX_SHADER = `#version 300 es
in vec4 aData;

uniform float uTime;
uniform float uAspect;
uniform float uSize;
uniform float uDpr;
uniform float uEnter;
uniform float uPointerActive;
uniform vec2 uPointer;
uniform vec2 uFit;

out float vLum;
out float vForce;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

void main() {
  vec2 base = aData.xy * uFit;
  float seed = aData.w;

  // A slow, per-point wander. Without it the cloud reads as a bitmap made of
  // dots; with it, it reads as something alive that happens to hold a shape.
  vec2 drift = vec2(
    sin(uTime * 0.6 + seed * 6.2831),
    cos(uTime * 0.5 + seed * 12.5664)
  ) * 0.005;

  // Entrance: points arrive from a scatter rather than fading in, so the
  // portrait assembles itself.
  vec2 scatter = vec2(hash(seed * 11.0) - 0.5, hash(seed * 27.0) - 0.5) * 2.0;
  vec2 pos = mix(base + scatter, base + drift, uEnter);

  // Aspect correction on the distance only, so the influence area is a circle
  // on screen rather than an ellipse.
  vec2 delta = (pos - uPointer) * vec2(uAspect, 1.0);
  float dist = length(delta);
  float force = uPointerActive * (1.0 - smoothstep(0.0, 0.45, dist));
  pos += normalize(delta + 1e-5) * force * 0.18 / vec2(uAspect, 1.0);

  vLum = aData.z;
  vForce = force;

  gl_Position = vec4(pos, 0.0, 1.0);
  gl_PointSize = uSize * uDpr * (1.0 + force * 1.6) * uEnter;
}`

const FRAGMENT_SHADER = `#version 300 es
precision mediump float;

in float vLum;
in float vForce;

uniform vec3 uDark;
uniform vec3 uLight;
uniform vec3 uAccent;

out vec4 outColor;

void main() {
  // gl_PointCoord makes each point a disc instead of a square. Squares at this
  // density look like a broken texture.
  float r = length(gl_PointCoord - 0.5);
  float alpha = 1.0 - smoothstep(0.34, 0.5, r);
  if (alpha < 0.01) discard;

  vec3 color = mix(uDark, uLight, vLum);
  color = mix(color, uAccent, vForce * 0.85);

  outColor = vec4(color, alpha);
}`

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('could not create shader')

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`shader failed to compile: ${log}`)
  }

  return shader
}

export interface PortraitOptions {
  points: SampleResult
  palette: Palette
  /** Renders a single settled frame and ignores the pointer. */
  reduceMotion: boolean
}

export interface PortraitHandle {
  setPalette(palette: Palette): void
  setPointer(x: number | null, y: number | null): void
  /** Starts or stops the animation loop; used to idle while off-screen. */
  setRunning(running: boolean): void
  destroy(): void
}

export function createParticlePortrait(
  canvas: HTMLCanvasElement,
  { points, palette, reduceMotion }: PortraitOptions,
): PortraitHandle | null {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    // The cloud is redrawn every frame, so there is nothing worth preserving
    // and telling the driver so avoids a copy.
    preserveDrawingBuffer: false,
    powerPreference: 'low-power',
  })
  if (!gl) return null

  const program = gl.createProgram()
  if (!program) return null

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }

  gl.useProgram(program)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, points.data, gl.STATIC_DRAW)

  const location = gl.getAttribLocation(program, 'aData')
  gl.enableVertexAttribArray(location)
  gl.vertexAttribPointer(location, 4, gl.FLOAT, false, 0, 0)

  const uniform = (name: string) => gl.getUniformLocation(program, name)
  const u = {
    time: uniform('uTime'),
    aspect: uniform('uAspect'),
    size: uniform('uSize'),
    dpr: uniform('uDpr'),
    enter: uniform('uEnter'),
    pointerActive: uniform('uPointerActive'),
    pointer: uniform('uPointer'),
    fit: uniform('uFit'),
    dark: uniform('uDark'),
    light: uniform('uLight'),
    accent: uniform('uAccent'),
  }

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  let pointer: [number, number] | null = null
  // Eased rather than snapped, so the cloud keeps moving for a moment after the
  // cursor stops instead of freezing mid-push.
  let pointerActive = 0
  let smoothed: [number, number] = [0, 0]
  let enter = reduceMotion ? 1 : 0
  let frame = 0
  let running = false
  let start = 0

  function applyPalette(next: Palette) {
    gl!.useProgram(program!)
    gl!.uniform3fv(u.dark, next.dark)
    gl!.uniform3fv(u.light, next.light)
    gl!.uniform3fv(u.accent, next.accent)
  }

  applyPalette(palette)

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if (width === 0 || height === 0) return

    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    gl!.viewport(0, 0, canvas.width, canvas.height)

    // "Contain" the portrait in the canvas, then inset it slightly so points
    // pushed by the pointer do not clip against the edge.
    const canvasAspect = width / height
    const fit: [number, number] =
      points.aspect > canvasAspect
        ? [0.92, (0.92 * canvasAspect) / points.aspect]
        : [(0.92 * points.aspect) / canvasAspect, 0.92]

    gl!.uniform2fv(u.fit, fit)
    gl!.uniform1f(u.aspect, canvasAspect)
    gl!.uniform1f(u.dpr, dpr)
    // Sized from the on-screen spacing between neighbouring points, so density
    // looks the same on a phone and on a 4K display.
    gl!.uniform1f(u.size, Math.max(1.4, ((width * fit[0]) / points.columns) * 1.6))
  }

  const observer = new ResizeObserver(() => {
    resize()
    if (!running) draw(performance.now())
  })
  observer.observe(canvas)
  resize()

  function draw(now: number) {
    if (!start) start = now
    const elapsed = (now - start) / 1000

    if (!reduceMotion) {
      // Ease towards the target rather than jumping, both for the entrance and
      // for the pointer, so nothing in the effect moves in a straight line.
      enter += (1 - enter) * 0.045
      const target = pointer ? 1 : 0
      pointerActive += (target - pointerActive) * 0.08
      if (pointer) {
        smoothed[0] += (pointer[0] - smoothed[0]) * 0.15
        smoothed[1] += (pointer[1] - smoothed[1]) * 0.15
      }
    }

    gl!.useProgram(program!)
    gl!.uniform1f(u.time, elapsed)
    gl!.uniform1f(u.enter, Math.min(enter, 1))
    gl!.uniform1f(u.pointerActive, pointerActive)
    gl!.uniform2f(u.pointer, smoothed[0], smoothed[1])

    gl!.clearColor(0, 0, 0, 0)
    gl!.clear(gl!.COLOR_BUFFER_BIT)
    gl!.drawArrays(gl!.POINTS, 0, points.count)
  }

  function loop(now: number) {
    draw(now)
    frame = requestAnimationFrame(loop)
  }

  return {
    setPalette: applyPalette,

    setPointer(x, y) {
      pointer = x === null || y === null ? null : [x, y]
      // First contact should not sweep the whole cloud across the canvas.
      if (pointer && pointerActive < 0.01) smoothed = [pointer[0], pointer[1]]
    },

    setRunning(next) {
      if (next === running) return
      running = next

      if (!next) {
        cancelAnimationFrame(frame)
        return
      }
      if (reduceMotion) {
        draw(performance.now())
        running = false
        return
      }
      // Reset the clock so a paused tab does not resume mid-jump.
      start = 0
      frame = requestAnimationFrame(loop)
    },

    destroy() {
      cancelAnimationFrame(frame)
      observer.disconnect()
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      // Frees the drawing buffer immediately instead of waiting for GC, which
      // matters because browsers cap the number of live GL contexts.
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
