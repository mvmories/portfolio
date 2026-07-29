import { useEffect, useState } from 'react'

import { safeFetch } from '@/lib/client'
import type { Skill } from '@/types/sanity'

/**
 * The skills list, shared by the Skills grid and the Experience timeline.
 *
 * Both need it — the grid renders every skill, the timeline maps a role's tech
 * tags onto their icons — and they previously issued two near-identical queries
 * that differed only by projection. One query means `safeFetch` can dedupe them
 * into a single request.
 *
 * The whole document is selected rather than a projection for the same reason:
 * two projections of the same documents are two cache entries and two requests,
 * and the extra fields here amount to a colour string.
 */
const QUERY = '*[_type == "skills"]'

export function useSkills(): Skill[] {
  const [skills, setSkills] = useState<Skill[]>([])

  useEffect(() => {
    let cancelled = false
    safeFetch<Skill[]>(QUERY, []).then((data) => {
      if (!cancelled) setSkills(data)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return skills
}
