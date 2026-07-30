import { useEffect, useRef, useState } from 'react'

import type { Palette, PortraitHandle } from '@/lib/particlePortrait'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'
import { useTheme } from '@/lib/useTheme'
import './ParticlePortrait.scss'

const PORTRAIT = '/hero/portrait'

/** Width the image is resampled to before points are taken. */
const SAMPLE_WIDTH = 420

/** Pixels between samples. Two keeps ~24k points, dense enough to read as a face. */
const SAMPLE_STEP = 2

function readColor(styles: CSSStyleDeclaration, name: string): [number, number, number] {
  const hex = styles.getPropertyValue(name).trim().replace('#', '')
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex

  const int = parseInt(full, 16)
  if (Number.isNaN(int) || full.length !== 6) return [0.5, 0.5, 0.5]

  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255]
}

function readPalette(element: HTMLElement): Palette {
  const styles = getComputedStyle(element)
  return {
    dark: readColor(styles, '--particle-dark'),
    light: readColor(styles, '--particle-light'),
    accent: readColor(styles, '--particle-accent'),
  }
}

/**
 * The hero portrait, rendered as an interactive point cloud.
 *
 * The <img> underneath is not a placeholder that gets thrown away - it is both
 * the sampling source and the fallback. Sampling the element the browser has
 * already decoded means the effect costs no extra network request, and anyone
 * without WebGL, with JavaScript off, or asking for reduced motion simply keeps
 * looking at the photograph.
 */
/**
 * Resolves once the browser has nothing more urgent to do, falling back to a
 * short timeout where requestIdleCallback is unavailable (Safari).
 */
function whenIdle(timeout = 2000) {
  return new Promise<void>((resolve) => {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(() => resolve(), { timeout })
    } else {
      setTimeout(resolve, 200)
    }
  })
}

const ParticlePortrait = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const handleRef = useRef<PortraitHandle | null>(null)

  const [ready, setReady] = useState(false)
  const { theme } = useTheme()
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const img = imgRef.current
    if (!canvas || !container || !img) return

    let cancelled = false
    let cleanup: (() => void) | undefined

    async function build() {
      // The photograph is the Largest Contentful Paint element, and sampling it
      // means decoding it into a scratch canvas and pushing ~24k points to the
      // GPU. Doing that while React is still booting competes with the paint
      // the visitor is actually waiting on, so hold until the browser is idle.
      // The photograph keeps the hero looking finished in the meantime.
      await whenIdle()
      if (cancelled) return

      // Imported lazily so the shader and sampling code stay out of the bundle
      // that has to arrive before the page can paint.
      const { createParticlePortrait, samplePoints } = await import('@/lib/particlePortrait')
      if (cancelled) return

      // decode() rather than the load event: it resolves once the pixels are
      // actually available to draw, which is what sampling needs. Older Safari
      // and jsdom have no decode(), so fall back to waiting for load.
      await (typeof img!.decode === 'function'
        ? img!.decode().catch(() => undefined)
        : new Promise((resolve) => {
            if (img!.complete) resolve(undefined)
            else img!.addEventListener('load', resolve, { once: true })
          }))
      if (cancelled || !img!.naturalWidth) return

      const height = Math.round((SAMPLE_WIDTH * img!.naturalHeight) / img!.naturalWidth)
      const scratch = document.createElement('canvas')
      scratch.width = SAMPLE_WIDTH
      scratch.height = height

      const context = scratch.getContext('2d', { willReadFrequently: true })
      if (!context) return

      context.drawImage(img!, 0, 0, SAMPLE_WIDTH, height)
      const points = samplePoints(context.getImageData(0, 0, SAMPLE_WIDTH, height), SAMPLE_STEP)
      if (cancelled) return

      const handle = createParticlePortrait(canvas!, {
        points,
        palette: readPalette(container!),
        reduceMotion,
      })
      // Null means no WebGL2. The photograph is already on screen, so there is
      // nothing to do but leave it there.
      if (!handle) return
      if (cancelled) {
        handle.destroy()
        return
      }

      handleRef.current = handle
      setReady(true)

      // Only animate while it can be seen. A hero that keeps a GPU busy while
      // the reader is at the bottom of the page is a battery bug.
      const visibility = new IntersectionObserver(
        ([entry]) => handle.setRunning(entry.isIntersecting && !document.hidden),
        { threshold: 0 },
      )
      visibility.observe(canvas!)

      const onVisibilityChange = () => handle.setRunning(!document.hidden)
      document.addEventListener('visibilitychange', onVisibilityChange)

      cleanup = () => {
        visibility.disconnect()
        document.removeEventListener('visibilitychange', onVisibilityChange)
        handle.destroy()
        handleRef.current = null
      }
    }

    void build()

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [reduceMotion])

  // Re-read the palette from CSS whenever the theme changes, rather than
  // duplicating the colour decisions in JavaScript.
  useEffect(() => {
    if (!ready || !containerRef.current) return
    handleRef.current?.setPalette(readPalette(containerRef.current))
  }, [theme, ready])

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const canvas = canvasRef.current
    if (!canvas || !handleRef.current) return

    const rect = canvas.getBoundingClientRect()
    handleRef.current.setPointer(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      1 - ((event.clientY - rect.top) / rect.height) * 2,
    )
  }

  return (
    <div
      ref={containerRef}
      className={`app__portrait${ready ? ' is-ready' : ''}`}
      onPointerMove={onPointerMove}
      onPointerLeave={() => handleRef.current?.setPointer(null, null)}
    >
      <picture>
        <source
          type='image/avif'
          srcSet={`${PORTRAIT}-420.avif 420w, ${PORTRAIT}-840.avif 840w`}
          sizes='(max-width: 1200px) 70vw, 440px'
        />
        <source
          type='image/webp'
          srcSet={`${PORTRAIT}-420.webp 420w, ${PORTRAIT}-840.webp 840w`}
          sizes='(max-width: 1200px) 70vw, 440px'
        />
        <img
          ref={imgRef}
          src={`${PORTRAIT}-420.png`}
          alt='Miguel Vilhena'
          width={420}
          height={383}
          {...({ fetchpriority: 'high' } as Record<string, string>)}
          decoding='async'
        />
      </picture>

      <canvas ref={canvasRef} aria-hidden='true' />
    </div>
  )
}

export default ParticlePortrait
