import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { client, urlFor } from '../../client'
import { AppWrap, MotionWrap } from '../../wrapper'
import './Testimonial.scss'

const Testimonial = () => {
  const [brands, setBrands] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleClick = (index) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    const query = '*[_type == "testimonials"]'
    const brandsQuery = '*[_type == "brands"]'

    client.fetch(query).then((data) => {
      setTestimonials(data)
    })

    client.fetch(brandsQuery).then((data) => {
      setBrands(data)
    })
  }, [])

  return (
    <>
      <h2 className='head-text'>Testimonials</h2>
      <h6 className='p-text'>Check LinkedIn for more details and testimonials</h6>

      {testimonials.length && (
        <>
          <div className='app__testimonial-item app__flex'>
            <img
              src={urlFor(testimonials[currentIndex].imgurl)}
              alt={testimonials[currentIndex].name}
            />
            <div className='app__testimonial-content'>
              <p className='p-text'>{`"${testimonials[currentIndex].feedback}"`}</p>
              <div>
                <h4 className='bold-text'>{testimonials[currentIndex].name}</h4>
                <h5 className='p-text'>{testimonials[currentIndex].company}</h5>
                <h6 className='p-text'>{testimonials[currentIndex].role}</h6>
              </div>
            </div>
          </div>

          <div className='app__testimonial-btns app__flex'>
            <div
              className='app__flex'
              onClick={() =>
                handleClick(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1)
              }
            >
              <HiChevronLeft />
            </div>
            <div
              className='app__flex'
              onClick={() =>
                handleClick(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1)
              }
            >
              <HiChevronRight />
            </div>
          </div>
        </>
      )}

      <h3
        className='p-text'
        style={{ marginTop: '4rem', fontSize: '1.2rem' }}
      >
        {'< Satisfied Customers />'}
      </h3>

      <div className='app__testimonial-brands app__flex'>
        {brands.map((brand) => (
          <motion.div
            whileInView={{ opacity: [0, 1] }}
            transition={{ duration: 0.5, type: 'tween' }}
            key={brand._id}
          >
            <img
              src={urlFor(brand.imgUrl)}
              alt={brand.name}
            />
          </motion.div>
        ))}
      </div>
    </>
  )
}

export default AppWrap(
  MotionWrap(Testimonial, 'app__testimonial'),
  'testimonials',
  'app__primarybg'
)
