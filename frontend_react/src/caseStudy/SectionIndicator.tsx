import { useEffect, useRef, useState } from 'react'

type Current = { num: string; title: string }

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
 */
const SectionIndicator = () => {
  const [current, setCurrent] = useState<Current | null>(null)
  const visible = useRef(new Set<Element>())

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('.cs-section'))
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
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
      { rootMargin: '-88px 0px -82% 0px' },
    )

    for (const section of sections) observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <p className='cs-where' data-shown={current !== null} aria-hidden='true'>
      <span className='cs-where-num'>{current?.num}</span>
      <span className='cs-where-title'>{current?.title}</span>
    </p>
  )
}

export default SectionIndicator
