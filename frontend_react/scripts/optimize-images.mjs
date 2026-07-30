/**
 * Generates the hero image in modern formats.
 *
 * The profile photo was a 484 kB PNG - the wrong container for a photograph,
 * and the single largest cost on the page. It was also the Largest Contentful
 * Paint element on mobile, so its weight set the score for the whole site.
 *
 * Output goes to `public/hero/` rather than through the normal asset pipeline,
 * because the point is to preload it from `index.html`. A preload needs a URL
 * that is known before the build produces content hashes, and `public/` is the
 * only place Vite guarantees a stable path. The tradeoff is losing hash-based
 * cache busting, which `netlify.toml` compensates for with a shorter max-age on
 * `/hero/*` than the immutable hashed assets get.
 *
 * Committed outputs, run on demand rather than on every build:
 *
 *   npm run images
 */

import {mkdir, readdir, stat, unlink} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

import sharp from 'sharp'

const root = path.dirname(fileURLToPath(import.meta.url))
const assets = path.join(root, '..', 'src', 'assets')
const source = path.join(assets, 'profile.png')
const outDir = path.join(root, '..', 'public', 'hero')

/**
 * The photo renders at roughly 400 px wide on a phone and 500 px on a desktop,
 * so 400 and 800 cover 1x and 2x. Any width above the source is dropped rather
 * than silently clamped, so a file called `profile-800` is always 800 px wide
 * and `srcSet` never advertises a resolution that does not exist.
 */
const WIDTHS = [400, 800]

const kb = (bytes) => `${Math.round(bytes / 1024)} kB`

async function main() {
  await mkdir(outDir, {recursive: true})

  // Clear stale output, so removing a width or format here does not leave an
  // orphan file being preloaded or served forever.
  for (const file of await readdir(outDir).catch(() => [])) {
    if (file.startsWith('profile-')) await unlink(path.join(outDir, file))
  }

  const before = (await stat(source)).size
  const {width, height} = await sharp(source).metadata()
  console.log(`source: profile.png  ${width}x${height}  ${kb(before)}\n`)

  const widths = WIDTHS.filter((w) => w <= width)
  if (!widths.includes(width)) widths.push(width)
  const skipped = WIDTHS.filter((w) => w > width)
  if (skipped.length) {
    console.log(`  (skipping ${skipped.join(', ')} - wider than the source)\n`)
  }

  let total = 0
  for (const w of widths) {
    for (const [format, options] of [
      ['avif', {quality: 55, effort: 6}],
      ['webp', {quality: 72}],
      // A PNG fallback keeps the alpha channel for browsers without AVIF or
      // WebP. It stays heavy, which is fine: nothing current will request it.
      ['png', {compressionLevel: 9, palette: true}],
    ]) {
      const name = `profile-${w}.${format}`
      const info = await sharp(source)
        .resize({width: w})
        [format](options)
        .toFile(path.join(outDir, name))

      total += info.size
      console.log(`  ${name.padEnd(20)} ${kb(info.size).padStart(8)}`)
    }
  }

  const largestAvif = (await stat(path.join(outDir, `profile-${widths.at(-1)}.avif`))).size
  console.log(
    `\ntotal written: ${kb(total)}` +
      `\nwhat a phone actually downloads: ${kb(before)} -> ${kb(largestAvif)} ` +
      `(${Math.round((1 - largestAvif / before) * 100)}% smaller)\n`
  )

  await portrait()
  await backgrounds()
}

/**
 * The head-and-shoulders crop, used two ways: as the sampling source for the
 * hero's particle portrait, and as the static image shown wherever WebGL is
 * unavailable or unwanted.
 *
 * The crop is fixed rather than face-detected because the source never changes
 * and a hand-picked box beats a detector that occasionally clips an ear. It was
 * chosen by scanning the alpha channel: the head spans y 0-300 and the
 * shoulders reach full width by y 420, so 90,0 -> 550,420 frames the subject
 * without the thumbs-up pose below it.
 */
const PORTRAIT_CROP = {left: 90, top: 0, width: 460, height: 420}

/** 1x for sampling (more points than the effect can show), 2x for the fallback. */
const PORTRAIT_WIDTHS = [420, 840]

async function portrait() {
  console.log('portrait:')

  for (const file of await readdir(outDir).catch(() => [])) {
    if (file.startsWith('portrait-')) await unlink(path.join(outDir, file))
  }

  for (const w of PORTRAIT_WIDTHS) {
    for (const [format, options] of [
      ['avif', {quality: 60, effort: 6}],
      ['webp', {quality: 78}],
      ['png', {compressionLevel: 9}],
    ]) {
      const name = `portrait-${w}.${format}`
      const info = await sharp(source)
        .extract(PORTRAIT_CROP)
        .resize({width: w})
        [format](options)
        .toFile(path.join(outDir, name))

      console.log(`  ${name.padEnd(20)} ${kb(info.size).padStart(8)}`)
    }
  }
  console.log()
}

/**
 * The two decorative backgrounds are referenced from SCSS rather than rendered
 * as elements, so they cannot use <picture>. They are re-encoded in place as
 * WebP, which every browser Vite targets supports, and the SCSS points at the
 * WebP directly - `image-set()` with a PNG fallback would ship both files to
 * some browsers to save bytes on none.
 *
 * bgIMG is a full-bleed 3840px texture behind the hero, downloaded on every
 * visit at 397 kB, which is more than the rest of the page combined.
 */
async function backgrounds() {
  console.log('backgrounds:')
  for (const name of ['bgIMG', 'bgWhite']) {
    const from = path.join(assets, `${name}.png`)
    const before = (await stat(from)).size

    // Capped at 1920px: these are blurred textures scaled with `background-size:
    // cover`, so the extra pixels of a 4K source are invisible at any viewport.
    const info = await sharp(from)
      .resize({width: 1920, withoutEnlargement: true})
      .webp({quality: 70})
      .toFile(path.join(assets, `${name}.webp`))

    console.log(
      `  ${name}.png -> ${name}.webp  ${kb(before)} -> ${kb(info.size)} ` +
        `(${Math.round((1 - info.size / before) * 100)}% smaller)`
    )
  }
  console.log()
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
