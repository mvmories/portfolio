import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

import { safeFetch, urlFor } from '@/lib/client'
import { AppWrap, MotionWrap } from '@/wrapper'
import type { Brand, Testimonial as TestimonialDoc } from '@/types/sanity'
import './Testimonial.scss'

const Testimonial = () => {
  const [brands, setBrands] = useState<Brand[]>([])
  const [testimonials, setTestimonials] = useState<TestimonialDoc[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    safeFetch<TestimonialDoc[]>('*[_type == "testimonials"]', []).then(setTestimonials)
    safeFetch<Brand[]>('*[_type == "brands"]', []).then(setBrands)
  }, [])

  const current = testimonials[currentIndex]

  return (
    <>
      <h2 className='head-text'>
        In their <span>words</span>
      </h2>
      {/* Was an h6 directly under the h2 - a four-level skip that reads as a
          missing subsection to a screen reader. It is a caption, not a heading. */}
      <p className='p-text'>Check LinkedIn for more details and testimonials</p>

      {testimonials.length > 0 && current && (
        <>
          <div className='app__testimonial-item app__flex'>
            <img
              src={urlFor(current.imgurl).width(200).height(200).fit('crop').auto('format').quality(80).url()}
              alt={current.name}
              width={100}
              height={100}
              decoding='async'
            />
            <div className='app__testimonial-content'>
              <p className='p-text'>{`"${current.feedback}"`}</p>
              <div>
                <h4 className='bold-text'>{current.name}</h4>
                <h5 className='p-text'>{current.company}</h5>
                <h6 className='p-text'>{current.role}</h6>
              </div>
            </div>
          </div>

          <div className='app__testimonial-btns app__flex'>
            <button
              type='button'
              className='app__flex'
              aria-label='Previous testimonial'
              onClick={() =>
                setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1)
              }
            >
              <HiChevronLeft />
            </button>
            <button
              type='button'
              className='app__flex'
              aria-label='Next testimonial'
              onClick={() =>
                setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1)
              }
            >
              <HiChevronRight />
            </button>
          </div>
        </>
      )}

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
