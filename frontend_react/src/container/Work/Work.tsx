import { useEffect, useState } from 'react'
import { AiFillEye, AiFillGithub } from 'react-icons/ai'

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
            <div className='app__work-img'>
              <img
                src={urlFor(work.imgUrl)
                  .width(900)
                  .height(600)
                  .fit('crop')
                  .auto('format')
                  .quality(80)
                  .url()}
                alt={work.title}
                width={450}
                height={300}
                loading='lazy'
                decoding='async'
              />

              <div className='app__work-hover'>
                {work.projectLink && (
                  <a
                    href={work.projectLink}
                    target='_blank'
                    rel='noreferrer'
                    aria-label={`View ${work.title}`}
                  >
                    <AiFillEye />
                  </a>
                )}
                {work.codeLink && (
                  <a
                    href={work.codeLink}
                    target='_blank'
                    rel='noreferrer'
                    aria-label={`Source code for ${work.title}`}
                  >
                    <AiFillGithub />
                  </a>
                )}
              </div>
            </div>

            <div className='app__work-content'>
              <h4 className='bold-text'>{work.title}</h4>

              {work.outcome && <p className='app__work-outcome'>{work.outcome}</p>}

              <p className='p-text'>{work.description}</p>

              <div className='app__work-rounded-tags'>
                {(work.tags ?? [])
                  .filter((tag) => tag !== 'All')
                  .map((tag) => (
                    <span key={tag} className='app__work-tag-rounded p-text'>
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

export default AppWrap(MotionWrap(Work, 'app__works'), 'work', 'app__primarybg')
