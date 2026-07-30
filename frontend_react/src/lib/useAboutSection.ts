import { useEffect, useState } from 'react'

import { safeFetch } from '@/lib/client'
import type { AboutSection } from '@/types/sanity'

/**
 * The copy the section renders when Sanity has nothing to say - which is the
 * case before the singleton is first published, and for any field left blank.
 *
 * Keeping the real words here rather than a placeholder means the page reads
 * correctly with the CMS empty, so publishing is never a prerequisite for the
 * site being right. Same contract as `useSiteSettings`.
 */
export const FALLBACK_ABOUT: AboutSection = {
  _type: 'aboutSection',
  narrative:
    "I'm a frontend engineer, and I've never much liked inheriting something finished. At IKEA I started a loyalty platform at a blank page; it's now in thirty countries. Before that I founded two companies and sold one. Fullstack when it counts — Node, Firestore, infrastructure as code — but the front is where I'm strongest. Most of my attention now goes to AI: agents that write the documentation nobody wants to write, and a local model stack I run on my own hardware to find out where it actually breaks.",
  stats: [
    { value: '30', label: 'countries live' },
    { value: '11', label: 'years shipping' },
    { value: '1', label: 'company built and sold' },
  ],
  portraitAlt: 'Miguel Vilhena',
}

// Fixed id, so the singleton is found without ordering or filtering and a stray
// second document could never be picked up by mistake.
const QUERY = `*[_id == "aboutSection"][0]{ narrative, stats, portrait, portraitAlt }`

/**
 * Merges what Sanity returned over the fallback, field by field rather than
 * document by document. A half-filled singleton is the normal state while the
 * copy is being edited, and falling back per field means a blank narrative
 * cannot take the stats down with it.
 */
export function resolveAboutSection(data: Partial<AboutSection> | null): AboutSection {
  if (!data) return FALLBACK_ABOUT

  return {
    _type: 'aboutSection',
    narrative: data.narrative?.trim() || FALLBACK_ABOUT.narrative,
    stats: data.stats?.length ? data.stats : FALLBACK_ABOUT.stats,
    portrait: data.portrait,
    portraitAlt: data.portraitAlt?.trim() || FALLBACK_ABOUT.portraitAlt,
  }
}

export function useAboutSection(): AboutSection {
  const [about, setAbout] = useState<AboutSection>(FALLBACK_ABOUT)

  useEffect(() => {
    let cancelled = false

    safeFetch<Partial<AboutSection> | null>(QUERY, null).then((data) => {
      if (!cancelled && data) setAbout(resolveAboutSection(data))
    })

    return () => {
      cancelled = true
    }
  }, [])

  return about
}
