import { motion } from 'framer-motion'
import { HiOutlineDocumentText } from 'react-icons/hi2'

import ParticlePortrait from '@/components/ParticlePortrait/ParticlePortrait'
import { images } from '@/constants'
import { useCv } from '@/lib/useCv'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'
import { useSiteSettings } from '@/lib/useSiteSettings'
import { AppWrap } from '@/wrapper'
import './Header.scss'

const Header = () => {
  const { heroTagline, availabilityEnabled, availabilityText } = useSiteSettings()
  const cv = useCv()
  const reduceMotion = usePrefersReducedMotion()

  return (
    <div className='app__header'>
      <div className='app__header-info'>
        {availabilityEnabled && (
          <p className='app__header-availability'>
            <span className='app__header-availability-dot' aria-hidden='true' />
            {availabilityText}
          </p>
        )}

        {/* The only h1 on the page, and it is the person's name - which is what
            the page is actually about, and what it should rank for. */}
        <h1 className='app__header-name'>Miguel Vilhena</h1>

        <p className='app__header-tagline'>{heroTagline}</p>

        <div className='app__header-actions'>
          {/* Points at experience, not work: the employed work is the proof,
              and it is now the section directly below About. */}
          <a className='app__btn app__btn--primary' href='#experience'>
            View my work
          </a>

          {cv && (
            <a
              className='app__btn app__btn--ghost'
              href={cv.viewUrl}
              target='_blank'
              rel='noopener noreferrer'
              title={cv.updated ? `Updated ${cv.updated}` : undefined}
            >
              <HiOutlineDocumentText aria-hidden='true' />
              {cv.label}
            </a>
          )}
        </div>
      </div>

      <div className='app__header-img'>
        <ParticlePortrait />
        <motion.img
          whileInView={{ scale: [0, 1] }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          src={images.circle}
          alt=''
          aria-hidden='true'
          className='overlay_circle'
        />
      </div>

      {/* Hidden for reduced motion: it is a bouncing arrow whose only job is to
          draw the eye, so there is nothing left of it once it cannot move. */}
      {!reduceMotion && (
        <a className='app__header-scroll' href='#about' aria-label='Scroll to about'>
          <span className='app__header-scroll-mouse' aria-hidden='true'>
            <span />
          </span>
        </a>
      )}
    </div>
  )
}

export default AppWrap(Header, 'home')
