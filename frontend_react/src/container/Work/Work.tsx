import { useEffect, useState } from 'react'
import { AiFillGithub } from 'react-icons/ai'
import { HiArrowUpRight } from 'react-icons/hi2'

import { AppWrap, MotionWrap } from '@/wrapper'
import { safeFetch, urlFor } from '@/lib/client'
import type { Work as WorkDoc } from '@/types/sanity'
import './Work.scss'

const Work = () => {
  const [works, setWorks] = useState<WorkDoc[]>([])

  useEffect(() => {
    safeFetch<WorkDoc[]>('*[_type == "works"] | order(_createdAt desc)', []).then(setWorks)
  }, [])

  return (
    <>
      {/* "Side projects" rather than "personal and client work". The old
          heading promised a portfolio, which one card cannot deliver, and the
          gap then needed a note apologising for NDAs. A side-projects section
          with one project in it is not short of anything: the employed work
          lives in the experience section directly above. */}
      <h2 className='head-text'>
        Side <span>projects</span>
      </h2>

      <div className='app__work-portfolio'>
        {works.map((work) => (
          <article className='app__work-item' key={work._id}>
            {/* Sanity crops to the ratio it is asked for, honouring the crop
                and hotspot set in the Studio, so it is asked for the ratio of
                the box the image lands in. Cropping again in CSS would ignore
                the hotspot and pick its own edge. */}
            <div className='app__work-media'>
              <img
                src={urlFor(work.imgUrl)
                  .width(960)
                  .height(540)
                  .fit('crop')
                  .auto('format')
                  .quality(85)
                  .url()}
                alt={work.title}
                width={960}
                height={540}
                loading='lazy'
                decoding='async'
              />
            </div>

            <div className='app__work-body'>
              <h3 className='app__work-title'>{work.title}</h3>

              {/* Two paragraphs doing different jobs. The outcome is the result
                  for whoever paid for it. The description is what was owned to
                  get there, in prose, because the design and research half of a
                  project dies when it is reduced to chips next to "Netlify". */}
              {work.outcome && <p className='app__work-lede'>{work.outcome}</p>}

              {work.description && <p className='app__work-prose'>{work.description}</p>}

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
