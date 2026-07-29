import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { AppWrap, MotionWrap } from '@/wrapper'
import { safeFetch, urlFor } from '@/lib/client'
import type { About as AboutDoc } from '@/types/sanity'
import './About.scss'

const About = () => {
  const [abouts, setAbouts] = useState<AboutDoc[]>([])

  useEffect(() => {
    safeFetch<AboutDoc[]>('*[_type == "about"]', []).then(setAbouts)
  }, [])

  return (
    <>
      <h2 className='head-text'>
        I Know That <span>Good Code</span>
        <br /> means <span>Good Business</span>
      </h2>

      <div className='app__profiles'>
        {abouts.map((about, index) => (
          <motion.div
            whileInView={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5, type: 'tween' }}
            className='app__profile-item'
            key={about._id ?? `${about.title}-${index}`}
          >
            <img
              src={urlFor(about.imgUrl).width(380).height(340).fit('crop').auto('format').quality(80).url()}
              alt={about.title}
              width={190}
              height={170}
              loading='lazy'
              decoding='async'
            />
            <h2 className='bold-text' style={{ marginTop: 20 }}>
              {about.title}
            </h2>
            <p className='p-text' style={{ marginTop: 10 }}>
              {about.description}
            </p>
          </motion.div>
        ))}
      </div>
    </>
  )
}

export default AppWrap(MotionWrap(About, 'app__about'), 'about', 'app__whitebg')
