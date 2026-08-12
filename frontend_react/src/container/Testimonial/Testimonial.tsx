import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

import { safeFetch, urlFor } from '@/lib/client'
import { QuoteCard } from '@/components'
import { AppWrap, MotionWrap } from '@/wrapper'
import type { Brand, Testimonial as TestimonialDoc } from '@/types/sanity'
import './Testimonial.scss'

// How many show when nothing is flagged in the Studio. Sanity is the editor of
// record; this only stops an unflagged dataset from dumping everything at once.
const FALLBACK_FEATURED_COUNT = 6

const TESTIMONIALS_QUERY = `*[_type == "testimonials"] | order(sortOrder asc, name asc) {
  _id, _type, name, company, role, feedback, imgurl, linkedInUrl, featured, sortOrder
}`

const Testimonial = () => {
  const [brands, setBrands] = useState<Brand[]>([])
  const [testimonials, setTestimonials] = useState<TestimonialDoc[]>([])
  const [expanded, setExpanded] = useState(false)
  const firstRevealedRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    safeFetch<TestimonialDoc[]>(TESTIMONIALS_QUERY, []).then(setTestimonials)
    safeFetch<Brand[]>('*[_type == "brands"]', []).then(setBrands)
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
        <a
          className='app__testimonial-source'
          href='https://www.linkedin.com/in/miguelvilhena/details/recommendations/'
          target='_blank'
          rel='noreferrer'
        >
          Read them in full on LinkedIn
        </a>
      </div>

      {/* The old heading claimed these were customers. They were not - they were
          employers, or clients of employers. P3-F curates the logos; the claim is
          corrected here because a false one costs more than an ugly one. */}
      <h3 className='p-text' style={{ marginTop: '4rem', fontSize: '1.2rem' }}>
        Where I&apos;ve done it
      </h3>

      <div className='app__testimonial-brands app__flex'>
        {brands.map((brand) => (
          <motion.div
            whileInView={{ opacity: [0, 1] }}
            transition={{ duration: 0.5, type: 'tween' }}
            key={brand._id}
          >
            <img
              src={urlFor(brand.imgUrl).width(300).auto('format').quality(80).url()}
              alt={brand.name}
              loading='lazy'
              decoding='async'
            />
          </motion.div>
        ))}
      </div>
    </>
  )
}

export default AppWrap(MotionWrap(Testimonial, 'app__testimonial'), 'testimonials', 'app__primarybg')
