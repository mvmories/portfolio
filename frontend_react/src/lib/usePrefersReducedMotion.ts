import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Tracks the user's motion preference.
 *
 * `index.css` already disables CSS transitions, but framer-motion animates
 * inline styles with JavaScript, so it never sees that rule. Animating a card's
 * height is exactly the kind of movement people disable motion to avoid, so the
 * preference has to be readable from JS too.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.(QUERY).matches === true
  )

  useEffect(() => {
    const media = window.matchMedia?.(QUERY)
    if (!media) return

    const onChange = (event: MediaQueryListEvent) => setPrefersReduced(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return prefersReduced
}
