import { urlFor } from '@/lib/client'
import { useAboutSection } from '@/lib/useAboutSection'
import { AppWrap, MotionWrap } from '@/wrapper'
import './About.scss'

/** The wider crop of the same shoot the hero's point cloud is sampled from. */
const PROFILE = '/hero/profile'

const About = () => {
  const { narrative, stats, portrait, portraitAlt } = useAboutSection()

  return (
    <>
      <h2 className='head-text'>
        The short <span>version</span>
      </h2>

      <div className='app__about-content'>
        {/* No entrance animation of its own: MotionWrap already fades the whole
            section in, and it is the thing that honours prefers-reduced-motion. */}
        <div className='app__about-portrait'>
          {/* A Sanity portrait wins when one is published; otherwise the bundled
              crop renders, so the section never depends on a publish. */}
          {portrait ? (
            <img
              src={urlFor(portrait)
                .width(880)
                .height(1100)
                .fit('crop')
                .auto('format')
                .quality(80)
                .url()}
              alt={portraitAlt}
              width={440}
              height={550}
              loading='lazy'
              decoding='async'
            />
          ) : (
            <picture>
              <source
                type='image/avif'
                srcSet={`${PROFILE}-400.avif 400w, ${PROFILE}-617.avif 617w`}
                sizes='(min-width: 900px) 380px, 70vw'
              />
              <source
                type='image/webp'
                srcSet={`${PROFILE}-400.webp 400w, ${PROFILE}-617.webp 617w`}
                sizes='(min-width: 900px) 380px, 70vw'
              />
              <img
                src={`${PROFILE}-617.png`}
                alt={portraitAlt}
                width={617}
                height={617}
                loading='lazy'
                decoding='async'
              />
            </picture>
          )}
        </div>

        <div className='app__about-text'>
          <p className='app__about-narrative'>{narrative}</p>

          {/* A definition list, because that is what it is: each number is the
              value of the term beside it, and it reads correctly unstyled. */}
          <dl className='app__about-stats'>
            {stats.map((stat) => (
              <div className='app__about-stat' key={stat._key ?? stat.label}>
                <dd className='app__about-stat-value'>{stat.value}</dd>
                <dt className='app__about-stat-label'>{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  )
}

export default AppWrap(MotionWrap(About, 'app__about'), 'about', 'app__whitebg')
