import { describe, expect, it } from 'vitest'

import { samplePoints } from './particlePortrait'

/**
 * Builds an ImageData-shaped object by hand. `ImageData` itself is available in
 * jsdom, but constructing the buffer directly keeps the expected pixel values
 * visible in the test rather than hidden behind a canvas.
 */
function image(
  width: number,
  height: number,
  pixel: (x: number, y: number) => [number, number, number, number],
) {
  const data = new Uint8ClampedArray(width * height * 4)
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const [r, g, b, a] = pixel(x, y)
      const i = (y * width + x) * 4
      data[i] = r
      data[i + 1] = g
      data[i + 2] = b
      data[i + 3] = a
    }
  }
  return { width, height, data } as ImageData
}

const OPAQUE_WHITE = (): [number, number, number, number] => [255, 255, 255, 255]

describe('samplePoints', () => {
  it('emits one point per sampled pixel', () => {
    const result = samplePoints(image(4, 4, OPAQUE_WHITE), 2)

    // Every other pixel in both axes: a 2x2 grid out of 4x4.
    expect(result.count).toBe(4)
    expect(result.data).toHaveLength(16)
  })

  it('drops pixels below the alpha threshold', () => {
    // The right half is fully transparent, so only the left half survives and
    // the silhouette has a hard edge rather than a fade.
    const half = image(4, 4, (x) => [255, 255, 255, x < 2 ? 255 : 0])

    expect(samplePoints(half, 1).count).toBe(8)
  })

  it('treats the threshold as a fraction of full opacity', () => {
    const faint = image(2, 2, () => [255, 255, 255, 88])

    // 88/255 is 0.345: under the default threshold, over a lower one.
    expect(samplePoints(faint, 1).count).toBe(0)
    expect(samplePoints(faint, 1, 0.3).count).toBe(4)
  })

  it('maps pixels into clip space with y pointing up', () => {
    const result = samplePoints(image(2, 2, OPAQUE_WHITE), 1)
    const [x0, y0] = result.data

    // Top-left pixel: the left edge of clip space, and the top, which is +1 in
    // GL but row 0 in image data.
    expect(x0).toBe(-1)
    expect(y0).toBe(1)
    // Third point, so the second row: one row down is the vertical centre.
    expect(result.data[9]).toBe(0)
  })

  it('weights luminance by Rec. 709 rather than averaging channels', () => {
    const green = samplePoints(image(1, 1, () => [0, 255, 0, 255]), 1)
    const blue = samplePoints(image(1, 1, () => [0, 0, 255, 255]), 1)

    expect(green.data[2]).toBeCloseTo(0.7152, 4)
    expect(blue.data[2]).toBeCloseTo(0.0722, 4)
  })

  it('reports the column count and aspect the renderer sizes points from', () => {
    const result = samplePoints(image(9, 4, OPAQUE_WHITE), 2)

    // Rounded up: the final column is sampled even though the step overshoots.
    expect(result.columns).toBe(5)
    expect(result.aspect).toBe(9 / 4)
  })

  it('gives every point its own seed so they do not drift in lockstep', () => {
    const result = samplePoints(image(8, 8, OPAQUE_WHITE), 1)
    const seeds = new Set<number>()
    for (let i = 3; i < result.data.length; i += 4) seeds.add(result.data[i])

    expect(seeds.size).toBeGreaterThan(result.count / 2)
  })
})
