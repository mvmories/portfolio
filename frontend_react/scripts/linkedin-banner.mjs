/**
 * Renders the LinkedIn cover banner into `.backups/linkedin-banner.png`.
 *
 * LinkedIn's banner is the largest thing above the fold on the profile, and it
 * is the only part of the page whose design is entirely ours. The previous one
 * was a stock pixel-art cityscape carrying someone else's brand names, so it
 * said nothing about Miguel and drew the eye to words that were not his.
 *
 * This deliberately reuses `og-image.mjs`'s palette, typefaces and tagline so
 * the profile, the social card and the site read as one identity.
 *
 * Two constraints drive the layout, and both come from LinkedIn's own UI:
 *
 *   1. The profile photo is overlaid on the LOWER LEFT of the banner on
 *      desktop, so anything placed there is hidden behind it.
 *   2. Narrow viewports crop the banner from both edges toward the centre.
 *
 * So the copy sits centre-right, clear of the avatar, and inside the region
 * that survives a mobile crop.
 *
 *   npm run banner
 *
 * Override the browser with CHROME=/path/to/chrome if the default is wrong.
 */

import {mkdtemp, readFile, rm, stat, writeFile} from 'node:fs/promises'
import {execFile} from 'node:child_process'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {promisify} from 'node:util'
import {fileURLToPath} from 'node:url'

import sharp from 'sharp'

const run = promisify(execFile)
const root = path.dirname(fileURLToPath(import.meta.url))
const pkg = path.join(root, '..')
const repo = path.join(pkg, '..')

// LinkedIn's own recommendation, and the size it stores without resampling.
const WIDTH = 1584
const HEIGHT = 396

const CHROME =
  process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const ROLE = 'Frontend engineer, fullstack when it counts, deep in AI'
const DOMAIN = 'miguelvilhena.com'

const dataUri = async (file, mime) =>
  `data:${mime};base64,${(await readFile(file)).toString('base64')}`

const banner = async () => {
  const display = await dataUri(
    path.join(
      pkg,
      'node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2',
    ),
    'font/woff2',
  )
  const base = await dataUri(
    path.join(pkg, 'node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2'),
    'font/woff2',
  )

  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Display'; src: url(${display}) format('woff2-variations'); font-weight: 200 800; }
  @font-face { font-family: 'Base'; src: url(${base}) format('woff2-variations'); font-weight: 100 1000; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; position: relative;
    background: #0b0d14; color: #f4f6ff; font-family: 'Base', sans-serif;
  }
  /* Echoes the social card's glow, moved left so it sits behind the avatar
     rather than behind the type. */
  .glow {
    position: absolute; top: -300px; left: -220px; width: 860px; height: 860px;
    background: radial-gradient(circle, rgba(69,85,200,0.5) 0%, rgba(69,85,200,0) 68%);
  }
  .glow-2 {
    position: absolute; bottom: -420px; right: -180px; width: 760px; height: 760px;
    background: radial-gradient(circle, rgba(125,143,240,0.22) 0%, rgba(125,143,240,0) 70%);
  }
  .copy {
    position: absolute; top: 0; bottom: 0; left: 560px; right: 96px;
    display: flex; flex-direction: column; justify-content: center;
  }
  .tagline {
    font-family: 'Display', sans-serif; font-weight: 800; font-size: 52px;
    line-height: 1.14; letter-spacing: -0.02em;
  }
  .tagline b { color: #9aa8f5; font-weight: 800; }
  .rule { width: 56px; height: 4px; background: #7d8ff0; border-radius: 2px; margin: 24px 0 20px; }
  .role { font-size: 21px; color: #aab2c8; line-height: 1.4; }
  .domain { margin-top: 18px; font-size: 20px; font-weight: 500; color: #7d8ff0; letter-spacing: 0.02em; }
</style></head>
<body>
  <div class="glow"></div>
  <div class="glow-2"></div>
  <div class="copy">
    <div class="tagline">I take products from a<br>blank page to <b>30 countries.</b></div>
    <div class="rule"></div>
    <div class="role">${ROLE}</div>
    <div class="domain">${DOMAIN}</div>
  </div>
</body></html>`
}

const out = path.join(repo, '.backups', 'linkedin-banner.png')
const dir = await mkdtemp(path.join(tmpdir(), 'banner-'))
const html = path.join(dir, 'banner.html')
const shot = path.join(dir, 'shot.png')

await writeFile(html, await banner())
await run(CHROME, [
  '--headless',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  `--window-size=${WIDTH},${HEIGHT}`,
  `--screenshot=${shot}`,
  '--virtual-time-budget=4000',
  `file://${html}`,
])

await sharp(shot).png({compressionLevel: 9, effort: 10}).toFile(out)
await rm(dir, {recursive: true, force: true})

const kb = Math.round((await stat(out)).size / 1024)
console.log(`wrote ${path.relative(repo, out)} (${kb} kB, ${WIDTH}x${HEIGHT})`)
