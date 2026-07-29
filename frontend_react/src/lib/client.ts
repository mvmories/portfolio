/**
 * Sanity connection.
 *
 * NOTE: no token is configured here on purpose. The `production` dataset is
 * public-read, so the browser needs no credentials. Any *write* (e.g. the
 * contact form) must go through a server-side function holding
 * `SANITY_WRITE_TOKEN` — never ship a token in this bundle.
 */

import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImage } from '@/types/sanity'

/**
 * The project id is public — it appears in every request URL and in this
 * bundle — so it falls back to a literal rather than leaving the site to die.
 * `createClient` throws when it is missing, and because that happens at module
 * scope it takes the entire app down with it, which would defeat `safeFetch`
 * below. An unset environment variable should degrade a section, not the site.
 */
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'khsof0do'
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
  perspective: 'published',
})

const builder = imageUrlBuilder(client)

export const urlFor = (source: SanityImage) => builder.image(source)

/** Fetch that never throws — sections render an empty state instead of blanking out. */
export async function safeFetch<T>(query: string, fallback: T): Promise<T> {
  try {
    return await client.fetch<T>(query)
  } catch (error) {
    console.error(`[sanity] query failed: ${query}`, error)
    return fallback
  }
}
