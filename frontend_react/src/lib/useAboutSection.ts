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
    "I'm a fullstack engineer, strongest on the frontend, and I've never much enjoyed inheriting something finished. At IKEA I inherited a one-country pilot instead - thin logic, thin UI - and I've carried it through every market launch since, to thirty countries. Forty years and 200 million members in, it was the first time an IKEA Family card could earn anything at all. Before that I founded and sold two companies. React and Node, GCP and infrastructure as code when it counts - but the front is where I'm sharpest. Most of my attention now goes to AI. I run models on hardware I own and build with agents daily, rebuilding how I work around a simple fact: one engineer can now attempt what used to need a team.",
  stats: [
    { value: '30', label: 'countries live' },
    { value: '11', label: 'years shipping' },
    { value: '2', label: 'companies built and sold' },
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
