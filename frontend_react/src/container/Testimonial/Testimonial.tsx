import { useEffect, useRef, useState } from 'react'

import { safeFetch } from '@/lib/client'
import { useSiteSettings } from '@/lib/useSiteSettings'
import { QuoteCard } from '@/components'
import { AppWrap, MotionWrap } from '@/wrapper'
import type { Testimonial as TestimonialDoc } from '@/types/sanity'
import './Testimonial.scss'

// How many show when nothing is flagged in the Studio. Sanity is the editor of
// record; this only stops an unflagged dataset from dumping everything at once.
const FALLBACK_FEATURED_COUNT = 6

// orderRank is written by drag and drop in the Studio. sortOrder is the previous
// hand-numbered field, kept only as a tiebreak: it still holds values in the
// dataset and governs the order until "Reset Order" has seeded every rank.
const TESTIMONIALS_QUERY = `*[_type == "testimonials"] | order(orderRank asc, sortOrder asc, name asc) {
  _id, _type, name, company, role, workedTogetherAt, feedback, imgurl, linkedInUrl,
  featured, sortOrder, orderRank
}`

const Testimonial = () => {
  const { socials } = useSiteSettings()
  const [testimonials, setTestimonials] = useState<TestimonialDoc[]>([])
  const [expanded, setExpanded] = useState(false)
  const firstRevealedRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    safeFetch<TestimonialDoc[]>(TESTIMONIALS_QUERY, []).then(setTestimonials)
  }, [])

  const flagged = testimonials.filter((item) => item.featured)
  const featured = flagged.length > 0 ? flagged : testimonials.slice(0, FALLBACK_FEATURED_COUNT)
  const rest = testimonials.filter((item) => !featured.includes(item))
  const visible = expanded ? [...featured, ...rest] : featured

  // Without this the newly revealed cards land below the fold and the reader is
  // left looking at the button they just pressed.
  useEffect(() => {
    if (expanded) firstRevealedRef.current?.focus()
  }, [expanded])

  // Derived from the profile already configured in site settings rather than
  // written out here. A hand-typed profile URL is one typo away from sending a
  // recruiter to a different person with the same name.
  const linkedInProfile = socials?.find((social) => social.platform === 'linkedin')?.url
  const recommendationsUrl = linkedInProfile
    ? `${linkedInProfile.replace(/\/+$/, '')}/details/recommendations/`
    : undefined

  return (
    <>
      <h2 className='head-text'>
        In their <span>words</span>
      </h2>
      {/* Was an h6 directly under the h2 - a four-level skip that reads as a
          missing subsection to a screen reader. It is a caption, not a heading. */}
      <p className='p-text'>Recommendations written on LinkedIn by people I worked with.</p>

      {visible.length > 0 && (
        <ul className='app__testimonial-grid'>
          {visible.map((item, index) => (
            <QuoteCard
              key={item._id}
              quote={item}
              ref={index === featured.length ? firstRevealedRef : undefined}
            />
          ))}
        </ul>
      )}

      {/* The count is the claim, so it comes from the data rather than a
          hardcoded "more". Expands in place: a modal or a route would cost the
          reader their position on the page for the sake of a few quotes. */}
      <div className='app__testimonial-actions'>
        {rest.length > 0 && !expanded && (
          <button type='button' className='app__testimonial-more' onClick={() => setExpanded(true)}>
            Read all {testimonials.length} recommendations
          </button>
        )}

        {/* Every quote here is clipped, so the unabridged versions need an
            address. LinkedIn gives recommendations no individual URL, only this
            one tab, which is why the link is section-level rather than per card. */}
        {recommendationsUrl && (
          <a
            className='app__testimonial-source'
            href={recommendationsUrl}
            target='_blank'
            rel='noreferrer'
          >
            Read them in full on LinkedIn
          </a>
        )}
      </div>
    </>
  )
}

export default AppWrap(MotionWrap(Testimonial, 'app__testimonial'), 'testimonials', 'app__primarybg')
