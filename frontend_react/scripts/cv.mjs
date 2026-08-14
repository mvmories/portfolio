/**
 * Builds the CV.
 *
 *   npm run cv
 *
 * Produces two things from the single content source in `scripts/cv/content.mjs`:
 *
 *   public/cv.pdf          the real document, designed, self-hosted
 *   .backups/cv-doc.html   open, select all, copy, paste into the Google Doc
 *
 * The PDF is rendered in Chrome rather than assembled with a PDF library for the
 * same reason `og-image.mjs` is: the site's typefaces ship as woff2 inside
 * node_modules, where no system font stack can see them, and a CV set in the
 * same fonts as the portfolio and the social card reads as one identity rather
 * than three. Chrome embeds them and keeps the text selectable, which matters
 * because an unselectable CV is invisible to every applicant tracking system.
 *
 * The Google Docs copy exists because the Doc is still the fallback the world
 * has a link to. It is generated rather than maintained by hand so it cannot
 * drift from the PDF.
 *
 * Override the browser with CHROME=/path/to/chrome if the default is wrong.
 */

import {execFile} from 'node:child_process'
import {mkdtemp, readFile, rm, stat, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {promisify} from 'node:util'

import * as content from './cv/content.mjs'
import {docHtml, printHtml} from './cv/templates.mjs'

const run = promisify(execFile)
const root = path.dirname(fileURLToPath(import.meta.url))
const pkg = path.join(root, '..')
const repo = path.join(pkg, '..')

const CHROME =
  process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const dataUri = async (file) =>
  `data:font/woff2;base64,${(await readFile(file)).toString('base64')}`

const fonts = {
  display: await dataUri(
    path.join(
      pkg,
      'node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2',
    ),
  ),
  base: await dataUri(
    path.join(pkg, 'node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2'),
  ),
}

const pdf = path.join(pkg, 'public', 'cv.pdf')
const docOut = path.join(repo, '.backups', 'cv-doc.html')

const dir = await mkdtemp(path.join(tmpdir(), 'cv-'))
const printSrc = path.join(dir, 'cv.html')

await writeFile(printSrc, printHtml({fonts, ...content}))
await writeFile(docOut, docHtml(content))

await run(CHROME, [
  '--headless',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--virtual-time-budget=5000',
  `--print-to-pdf=${pdf}`,
  `file://${printSrc}`,
])

await rm(dir, {recursive: true, force: true})

const kb = Math.round((await stat(pdf)).size / 1024)
console.log(`wrote ${path.relative(repo, pdf)} (${kb} kB)`)
console.log(`wrote ${path.relative(repo, docOut)}`)
