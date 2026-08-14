import { useEffect, useRef, useState } from 'react'

type Current = { num: string; title: string }

/** Where the band starts: clear of the fixed bar. */
const TOP_OFFSET = 88

/**
 * Tells the reader which section they are in.
 *
 * Ten sections is past the point where position can be held in the head, and
 * the page deliberately has no sidebar or table of contents to hold it for
 * them. The observer watches a narrow band just below the fixed bar rather
 * than the whole viewport, so the answer is whichever section is under the
 * top edge of the screen, which is what someone scrolling actually means by
 * "where am I".
 *
 * It reads the number and heading out of the DOM instead of taking a list of
 * sections as a prop, so a section added to the page cannot be forgotten here.
 * Hidden from assistive technology on purpose: the headings already carry the
 * structure, and a label that rewrites itself on every scroll is noise.
 *
 * The band is measured in pixels rather than as a percentage of the viewport.
 * Expressed as a percentage it inverts on any viewport shorter than about
 * 490px, which is every phone held sideways: the bottom edge climbs above the
 * top edge, nothing can intersect an impossible band, and the label silently
 * never appears. Recomputed on resize for the same reason.
 */
const SectionIndicator = () => {
  const [current, setCurrent] = useState<Current | null>(null)
  const visible = useRef(new Set<Element>())

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('.cs-section'))
    if (sections.length === 0) return

    let observer: IntersectionObserver | null = null

    const connect = () => {
      observer?.disconnect()
      visible.current.clear()

      // A band that starts below the fixed bar and is never taller than the
      // room left beneath it.
      const top = TOP_OFFSET
      const depth = Math.max(40, Math.min(120, Math.round(window.innerHeight * 0.18)))
      const bottom = Math.max(0, window.innerHeight - top - depth)

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) visible.current.add(entry.target)
            else visible.current.delete(entry.target)
          }

          // At a boundary two sections briefly share the band. The later one in
          // document order is the one being scrolled into.
          const active = sections.filter((s) => visible.current.has(s)).pop()

          if (!active) {
            setCurrent(null)
            return
          }

          setCurrent({
            num: active.querySelector('.cs-num')?.textContent ?? '',
            title: active.querySelector('h2')?.textContent ?? '',
          })
        },
        { rootMargin: `-${top}px 0px -${bottom}px 0px` },
      )

      for (const section of sections) observer.observe(section)
    }

    connect()
    window.addEventListener('resize', connect)
    window.addEventListener('orientationchange', connect)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', connect)
      window.removeEventListener('orientationchange', connect)
    }
  }, [])

  return (
    <p className='cs-where' data-shown={current !== null} aria-hidden='true'>
      <span className='cs-where-num'>{current?.num}</span>
      <span className='cs-where-title'>{current?.title}</span>
    </p>
  )
}

export default SectionIndicator
