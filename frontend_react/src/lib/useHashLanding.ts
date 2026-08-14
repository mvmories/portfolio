import { useEffect } from 'react'

import { SECTIONS } from '@/constants/sections'
import type { SectionId } from '@/types/sanity'

/**
 * How long the target is held in place while the page loads.
 *
 * Long enough to cover a Sanity fetch and the images that follow it, short
 * enough that nobody is ever pinned for a noticeable length of time.
 */
const HOLD_MS = 4000

const isSectionId = (value: string): value is SectionId =>
  (SECTIONS as readonly string[]).includes(value)

/**
 * Makes deep links to a section actually land on it.
 *
 * The browser tries to reach the fragment once, as soon as it has parsed the
 * document. At that moment this page is an empty root element: React has not
 * mounted, the target does not exist, and the attempt is abandoned without a
 * word. Every `#section` link from outside the page dropped the visitor at the
 * top of the hero instead.
 *
 * Scrolling once after mount is not enough either, and that is the version
 * that looks fixed while still being broken. Sections fill from Sanity and
 * their images arrive afterwards, so the target keeps sliding down the
 * document while content loads: aiming at it once leaves the visitor wherever
 * that section used to be. It is therefore held at the top of the viewport,
 * frame by frame, for as long as content could still be arriving.
 *
 * Waiting for the layout to stop changing was tried first and is wrong: while
 * the fetch is in flight nothing moves at all, which is indistinguishable from
 * a page that has finished.
 *
 * Any deliberate scroll ends it immediately. Someone who starts reading before
 * the page has settled must never be dragged somewhere else.
 */
export function useHashLanding(holdMs: number = HOLD_MS): void {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id || !isSectionId(id)) return

    let stopped = false
    let frame = 0
    const startedAt = Date.now()

    // `scroll-padding-top` on the root already accounts for the fixed navbar,
    // so this lands below it rather than behind it.
    const align = () => document.getElementById(id)?.scrollIntoView({ block: 'start' })

    // Anything the visitor does deliberately ends it, including following a
    // navigation link, which changes the hash out from under us.
    const ABORT = ['wheel', 'touchstart', 'pointerdown', 'keydown', 'hashchange'] as const

    const stop = () => {
      stopped = true
      if (frame) cancelAnimationFrame(frame)
      for (const event of ABORT) window.removeEventListener(event, stop)
    }

    const tick = () => {
      if (stopped) return
      if (Date.now() - startedAt > holdMs) {
        stop()
        return
      }

      align()
      frame = requestAnimationFrame(tick)
    }

    for (const event of ABORT) window.addEventListener(event, stop, { passive: true })

    align()
    frame = requestAnimationFrame(tick)
    return stop
  }, [holdMs])
}
