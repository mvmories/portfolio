import { useEffect, useState } from 'react'
import { AiFillGithub } from 'react-icons/ai'
import { HiArrowUpRight } from 'react-icons/hi2'

import { AppWrap, MotionWrap } from '@/wrapper'
import { safeFetch, urlFor } from '@/lib/client'
import { useSiteSettings } from '@/lib/useSiteSettings'
import type { Work as WorkDoc } from '@/types/sanity'
import './Work.scss'

const Work = () => {
  const [works, setWorks] = useState<WorkDoc[]>([])
  const { workNote } = useSiteSettings()

  useEffect(() => {
    safeFetch<WorkDoc[]>('*[_type == "works"] | order(_createdAt desc)', []).then(setWorks)
  }, [])

  return (
    <>
      <h2 className='head-text'>
        Personal and client <span>work</span>
      </h2>

      {workNote && <p className='app__work-note p-text'>{workNote}</p>}

      <div className='app__work-portfolio'>
        {works.map((work) => (
          <article className='app__work-item' key={work._id}>
            <div className='app__work-media'>
              <img
                src={urlFor(work.imgUrl)
                  .width(1200)
                  .height(900)
                  .fit('crop')
                  .auto('format')
                  .quality(80)
                  .url()}
                alt={work.title}
                width={600}
                height={450}
                loading='lazy'
                decoding='async'
              />
            </div>

            <div className='app__work-body'>
              <h3 className='app__work-title'>{work.title}</h3>

              {/* The outcome is the whole point of the card, so it is the card's
                  only prose. The description is a fallback for projects that
                  have not earned an outcome line yet. */}
              <p className='app__work-lede'>{work.outcome || work.description}</p>

              {work.tags && work.tags.length > 0 && (
                <p className='app__work-stack'>
                  {work.tags.filter((tag) => tag !== 'All').join(' · ')}
                </p>
              )}

              <div className='app__work-actions'>
                {work.projectLink && (
                  <a
                    className='app__work-action'
                    href={work.projectLink}
                    target='_blank'
                    rel='noreferrer'
                  >
                    Visit the site
                    <HiArrowUpRight aria-hidden='true' />
                    <span className='sr-only'>{`, ${work.title}, opens in a new tab`}</span>
                  </a>
                )}
                {work.codeLink && (
                  <a
                    className='app__work-action app__work-action--secondary'
                    href={work.codeLink}
                    target='_blank'
                    rel='noreferrer'
                  >
                    <AiFillGithub aria-hidden='true' />
                    Source
                    <span className='sr-only'>{`, ${work.title}, opens in a new tab`}</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

export default AppWrap(MotionWrap(Work, 'app__works'), 'work', 'app__primarybg')
