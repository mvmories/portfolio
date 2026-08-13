/**
 * Renders the social preview card into `public/og.png`.
 *
 * Every time the site gets pasted into a LinkedIn message, a WhatsApp thread or
 * a Slack channel, this image is the whole first impression. Without it the
 * link renders as bare blue text, which is a worse advert than the site is a
 * site.
 *
 * It is rendered in Chrome rather than composed with sharp because the card has
 * to use the same typefaces as the site, and the fonts ship as woff2 inside
 * node_modules where fontconfig, and therefore sharp's SVG text rendering,
 * cannot see them. A browser can.
 *
 * Output is committed, and this is run by hand when the wording changes:
 *
 *   npm run og
 *
 * Override the browser with CHROME=/path/to/chrome if the default is wrong.
 */

import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises'
import {execFile} from 'node:child_process'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {promisify} from 'node:util'
import {fileURLToPath} from 'node:url'

const run = promisify(execFile)
const root = path.dirname(fileURLToPath(import.meta.url))
const pkg = path.join(root, '..')

// Facebook, LinkedIn, X and Slack all crop to roughly 1.91:1, so 1200x630 is
// the size that survives every one of them without a letterbox.
const WIDTH = 1200
const HEIGHT = 630

const CHROME =
  process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const NAME = 'Miguel Vilhena'
const TAGLINE = 'I take products from a blank page to 30 countries.'
const ROLE = 'Frontend engineer, fullstack when it counts, deep in AI'
const DOMAIN = 'miguelvilhena.com'

const dataUri = async (file, mime) =>
  `data:${mime};base64,${(await readFile(file)).toString('base64')}`

const card = async () => {
  const display = await dataUri(
    path.join(pkg, 'node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2'),
    'font/woff2',
  )
  const base = await dataUri(
    path.join(pkg, 'node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2'),
    'font/woff2',
  )
  const portrait = await dataUri(path.join(pkg, 'public/hero/portrait-840.webp'), 'image/webp')

  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Display'; src: url(${display}) format('woff2-variations'); font-weight: 200 800; }
  @font-face { font-family: 'Base'; src: url(${base}) format('woff2-variations'); font-weight: 100 1000; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px; display: flex; overflow: hidden;
    background: #0b0d14; color: #f4f6ff; font-family: 'Base', sans-serif;
  }
  .glow {
    position: absolute; top: -220px; left: -160px; width: 720px; height: 720px;
    background: radial-gradient(circle, rgba(69,85,200,0.55) 0%, rgba(69,85,200,0) 68%);
  }
  .copy { position: relative; flex: 1; padding: 76px 0 76px 84px; display: flex; flex-direction: column; justify-content: center; }
  .name { font-family: 'Display', sans-serif; font-weight: 800; font-size: 40px; letter-spacing: -0.01em; }
  .rule { width: 64px; height: 4px; background: #7d8ff0; border-radius: 2px; margin: 22px 0 26px; }
  .tagline { font-family: 'Display', sans-serif; font-weight: 800; font-size: 58px; line-height: 1.14; letter-spacing: -0.02em; }
  .tagline b { color: #9aa8f5; font-weight: 800; }
  .role { margin-top: 30px; font-size: 23px; color: #aab2c8; max-width: 26ch; line-height: 1.4; }
  .domain { margin-top: 40px; font-size: 21px; font-weight: 500; color: #7d8ff0; letter-spacing: 0.02em; }
  .side { position: relative; width: 430px; display: flex; align-items: center; justify-content: center; }
  .side img { width: 330px; height: 330px; border-radius: 50%; object-fit: cover; border: 3px solid rgba(125,143,240,0.5); }
</style></head>
<body>
  <div class="glow"></div>
  <div class="copy">
    <div class="name">${NAME}</div>
    <div class="rule"></div>
    <div class="tagline">I take products from<br>a blank page to<br><b>30 countries.</b></div>
    <div class="role">${ROLE}</div>
    <div class="domain">${DOMAIN}</div>
  </div>
  <div class="side"><img src="${portrait}" alt=""></div>
</body></html>`
}

const out = path.join(pkg, 'public', 'og.png')
const dir = await mkdtemp(path.join(tmpdir(), 'og-'))
const html = path.join(dir, 'card.html')

await writeFile(html, await card())
await run(CHROME, [
  '--headless',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  `--window-size=${WIDTH},${HEIGHT}`,
  `--screenshot=${out}`,
  '--virtual-time-budget=4000',
  `file://${html}`,
])
await rm(dir, {recursive: true, force: true})

console.log(`wrote ${path.relative(pkg, out)}`)
console.log(`tagline: ${TAGLINE}`)
