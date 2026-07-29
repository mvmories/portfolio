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

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
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
