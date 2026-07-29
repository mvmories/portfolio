import { useEffect, useState } from 'react'

import { SECTIONS } from '@/constants/sections'
import type { SectionId } from '@/types/sanity'

/** Enough steps that a section crossing the viewport reports smoothly. */
const THRESHOLDS = [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1]

/**
 * Reports which section currently occupies most of the viewport.
 *
 * Scroll position alone is not enough: sections vary in height, so "the last
 * heading I scrolled past" and "the section I am actually looking at" diverge.
 * Comparing visible ratios answers the second question, which is the one the
 * nav highlight is claiming to answer.
 *
 * The observer is offset by the navbar height so a section is not counted as
 * visible while it sits behind the bar.
 */
export function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>(SECTIONS[0])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const elements = SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (elements.length === 0) return

    // Ratios are kept across callbacks because a callback only carries the
    // entries that changed, not the full picture.
    const ratios = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }

        let best: SectionId | null = null
        let bestRatio = 0
        for (const id of SECTIONS) {
          const ratio = ratios.get(id) ?? 0
          if (ratio > bestRatio) {
            best = id
            bestRatio = ratio
          }
        }

        // Nothing visible happens momentarily during fast scrolling; keeping
        // the previous value avoids the highlight blinking off.
        if (best) setActive(best)
      },
      { threshold: THRESHOLDS, rootMargin: '-72px 0px 0px 0px' },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return active
}
