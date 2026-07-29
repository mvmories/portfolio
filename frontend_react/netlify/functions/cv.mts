import type { Config } from '@netlify/functions'
import { createClient } from '@sanity/client'

/**
 * Redirects miguelvilhena.com/cv to whichever Drive file is currently set in
 * Sanity, so the public link never changes even when the underlying file does.
 *
 * Resolved server-side on each request rather than baked into the bundle, so
 * updating the CV needs no redeploy.
 */

const FALLBACK_CV =
  'https://drive.google.com/file/d/1UzYCsJGdeNB5LJ3TGRXbz9GtKPrSzdee/view?usp=share_link'

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || 'khsof0do',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

export default async (req: Request) => {
  let target = FALLBACK_CV
  let enabled = true

  try {
    const settings = await sanity.fetch<{ cvUrl?: string; cvEnabled?: boolean } | null>(
      '*[_id == "siteSettings"][0]{ cvUrl, cvEnabled }',
    )
    if (settings?.cvEnabled === false) enabled = false
    if (settings?.cvUrl) target = settings.cvUrl
  } catch (error) {
    // A Sanity outage should still serve the last known good link rather than
    // turning a CV people are actively opening into an error page.
    console.error('[cv] settings lookup failed, using fallback', error)
  }

  if (!enabled) {
    return new Response('CV is not currently available.', {
      status: 404,
      headers: { 'content-type': 'text/plain' },
    })
  }

  // Only https Drive/Docs links are followed, so a bad value in the CMS cannot
  // turn this into an open redirect.
  if (!/^https:\/\/(drive|docs)\.google\.com\//.test(target)) {
    console.error('[cv] refusing to redirect to an unexpected host', target)
    target = FALLBACK_CV
  }

  const wantsDownload = new URL(req.url).searchParams.has('download')
  const fileId = /\/d\/([a-zA-Z0-9_-]+)/.exec(target)?.[1]

  const location =
    wantsDownload && fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : target

  return new Response(null, {
    status: 302,
    headers: {
      location,
      // Short cache: long enough to absorb bursts, short enough that a new CV
      // goes live within minutes rather than being pinned at the edge.
      'cache-control': 'public, max-age=300',
    },
  })
}

export const config: Config = {
  path: '/cv',
}
