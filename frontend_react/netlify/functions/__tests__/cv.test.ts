import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * The /cv route broke silently once: its allowlist predated the move off Google
 * Drive, so when Sanity started pointing at the self-hosted PDF the guard
 * rejected it and quietly served the superseded Drive file instead. It returned
 * 302 the whole time, which is why nothing caught it.
 *
 * These cover the redirect target rather than the plumbing, because the target
 * is the part that can be wrong while everything still looks healthy.
 *
 * Kept in a subdirectory because Netlify treats every top-level file in the
 * functions directory as a function to bundle, and a test importing vitest
 * fails that bundle.
 */

const fetchSettings = vi.fn()

vi.mock('@sanity/client', () => ({
  createClient: () => ({ fetch: fetchSettings }),
}))

const load = async () => (await import('../cv.mjs')).default

const call = async (url = 'https://miguelvilhena.com/cv') => {
  const handler = await load()
  return handler(new Request(url))
}

beforeEach(() => {
  vi.resetModules()
  fetchSettings.mockReset()
})

describe('the /cv redirect', () => {
  it('follows the self-hosted CV the CMS points at', async () => {
    fetchSettings.mockResolvedValue({ cvUrl: 'https://miguelvilhena.com/cv.pdf' })

    const res = await call()

    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe('https://miguelvilhena.com/cv.pdf')
  })

  it('still follows a Google Drive link, since the CV may move back', async () => {
    const drive = 'https://drive.google.com/file/d/abc123/view'
    fetchSettings.mockResolvedValue({ cvUrl: drive })

    expect((await call()).headers.get('location')).toBe(drive)
  })

  it('refuses a host that is neither the site nor Drive', async () => {
    fetchSettings.mockResolvedValue({ cvUrl: 'https://evil.example.com/cv.pdf' })

    expect((await call()).headers.get('location')).toBe('https://miguelvilhena.com/cv.pdf')
  })

  it('refuses a lookalike domain rather than matching it loosely', async () => {
    fetchSettings.mockResolvedValue({ cvUrl: 'https://miguelvilhenaXcom/cv.pdf' })

    expect((await call()).headers.get('location')).toBe('https://miguelvilhena.com/cv.pdf')
  })

  it('refuses a downgraded scheme', async () => {
    fetchSettings.mockResolvedValue({ cvUrl: 'http://miguelvilhena.com/cv.pdf' })

    expect((await call()).headers.get('location')).toBe('https://miguelvilhena.com/cv.pdf')
  })

  it('serves the self-hosted CV when Sanity is unreachable', async () => {
    fetchSettings.mockRejectedValue(new Error('down'))

    expect((await call()).headers.get('location')).toBe('https://miguelvilhena.com/cv.pdf')
  })

  it('sends ?download to Drive\u2019s streaming endpoint', async () => {
    fetchSettings.mockResolvedValue({
      cvUrl: 'https://drive.google.com/file/d/abc123/view?usp=share_link',
    })

    const res = await call('https://miguelvilhena.com/cv?download')

    expect(res.headers.get('location')).toBe(
      'https://drive.google.com/uc?export=download&id=abc123',
    )
  })

  it('leaves ?download alone for the self-hosted PDF, which has no such split', async () => {
    fetchSettings.mockResolvedValue({ cvUrl: 'https://miguelvilhena.com/cv.pdf' })

    const res = await call('https://miguelvilhena.com/cv?download')

    expect(res.headers.get('location')).toBe('https://miguelvilhena.com/cv.pdf')
  })

  it('404s when the CV is switched off in the CMS', async () => {
    fetchSettings.mockResolvedValue({
      cvEnabled: false,
      cvUrl: 'https://miguelvilhena.com/cv.pdf',
    })

    expect((await call()).status).toBe(404)
  })
})
