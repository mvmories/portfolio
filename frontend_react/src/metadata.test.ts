import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

// These tags have no on-screen representation, so nothing else in the suite
// would notice them disappearing. The failure mode is silent and only shows up
// as a bare blue link the next time the site is pasted into LinkedIn or Slack,
// which is exactly when it matters most.
const html = readFileSync(resolve(__dirname, '../index.html'), 'utf-8')

const SITE = 'https://miguelvilhena.com'

describe('index.html metadata', () => {
  it('declares a canonical URL', () => {
    expect(html).toContain(`<link rel="canonical" href="${SITE}/" />`)
  })

  it.each([
    'og:type',
    'og:url',
    'og:title',
    'og:description',
    'og:image',
    'og:image:width',
    'og:image:height',
    'og:image:alt',
  ])('sets %s', (property) => {
    expect(html).toMatch(new RegExp(`property="${property}"`))
  })

  it('sets a large summary card for X', () => {
    expect(html).toContain('name="twitter:card" content="summary_large_image"')
  })

  // Relative URLs are the classic way this breaks: they resolve fine in a
  // browser and not at all in a scraper.
  it('points every social image at an absolute URL', () => {
    const images = [...html.matchAll(/(?:property|name)="(?:og|twitter):image"\s+content="([^"]+)"/g)]

    expect(images.length).toBeGreaterThan(0)
    for (const [, url] of images) expect(url).toBe(`${SITE}/og.png`)
  })

  it('ships valid Person and WebSite structured data', () => {
    const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
    expect(match).not.toBeNull()

    const graph = JSON.parse(match![1]) as {
      '@graph': Array<{ '@type': string; sameAs?: string[] }>
    }
    const types = graph['@graph'].map((node) => node['@type'])
    expect(types).toContain('Person')
    expect(types).toContain('WebSite')

    // A wrong LinkedIn URL has shipped here once before, pointing at a
    // different person entirely.
    const person = graph['@graph'].find((node) => node['@type'] === 'Person')
    expect(person?.sameAs).toContain('https://www.linkedin.com/in/miguel-vilhena-215aa590/')
  })

  it('has a title that says what he does', () => {
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1]

    expect(title).toBeDefined()
    expect(title!.length).toBeLessThanOrEqual(70)
    expect(title).toMatch(/Miguel Vilhena/)
  })
})
