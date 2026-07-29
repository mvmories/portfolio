import { useEffect, useMemo, useState } from 'react'
import { AiFillEye, AiFillGithub } from 'react-icons/ai'
import { motion } from 'framer-motion'

import { AppWrap, MotionWrap } from '@/wrapper'
import { safeFetch, urlFor } from '@/lib/client'
import type { Work as WorkDoc } from '@/types/sanity'
import './Work.scss'

const Work = () => {
  const [works, setWorks] = useState<WorkDoc[]>([])
  const [filterWork, setFilterWork] = useState<WorkDoc[]>([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [animateCard, setAnimateCard] = useState({ y: 0, opacity: 1 })

  useEffect(() => {
    safeFetch<WorkDoc[]>('*[_type == "works"]', []).then((data) => {
      setWorks(data)
      setFilterWork(data)
    })
  }, [])

  // Derive filters from the data rather than hardcoding them.
  const filters = useMemo(() => {
    const tags = new Set<string>()
    works.forEach((work) => work.tags?.forEach((tag) => tag !== 'All' && tags.add(tag)))
    return [...[...tags].sort(), 'All']
  }, [works])

  const handleWorkFilter = (item: string) => {
    setActiveFilter(item)
    setAnimateCard({ y: 100, opacity: 0 })

    setTimeout(() => {
      setAnimateCard({ y: 0, opacity: 1 })
      setFilterWork(
        item === 'All' ? works : works.filter((work) => work.tags?.includes(item))
      )
    }, 500)
  }

  return (
    <>
      <h2 className='head-text'>
        My Creative <span>Portfolio</span> Section
      </h2>

      <div className='app__work-filter'>
        {filters.map((item) => (
          <button
            type='button'
            key={item}
            onClick={() => handleWorkFilter(item)}
            aria-pressed={activeFilter === item}
            className={`app__work-filter-item app__flex p-text ${
              activeFilter === item ? 'item-active' : ''
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <motion.div
        animate={animateCard}
        transition={{ duration: 0.5, delayChildren: 0.5 }}
        className='app__work-portfolio'
      >
        {filterWork.map((work) => {
          const [primaryTag, ...otherTags] = work.tags ?? []

          return (
            <div className='app__work-item app__flex' key={work._id}>
              <div className='app__work-img app__flex'>
                <img
                  src={urlFor(work.imgUrl).width(600).height(460).fit('crop').auto('format').quality(80).url()}
                  alt={work.title}
                  width={300}
                  height={230}
                  loading='lazy'
                  decoding='async'
                />

                <motion.div
                  whileHover={{ opacity: [0, 1] }}
                  transition={{ duration: 0.25, ease: 'easeInOut', staggerChildren: 0.5 }}
                  className='app__work-hover app__flex'
                >
                  {work.projectLink && (
                    <a href={work.projectLink} target='_blank' rel='noreferrer' aria-label={`View ${work.title}`}>
                      <motion.div
                        whileInView={{ scale: [0, 1] }}
                        whileHover={{ scale: [1, 0.9] }}
                        transition={{ duration: 0.25 }}
                        className='app__flex'
                      >
                        <AiFillEye />
                      </motion.div>
                    </a>
                  )}
                  {work.codeLink && (
                    <a href={work.codeLink} target='_blank' rel='noreferrer' aria-label={`Source code for ${work.title}`}>
                      <motion.div
                        whileInView={{ scale: [0, 1] }}
                        whileHover={{ scale: [1, 0.9] }}
                        transition={{ duration: 0.25 }}
                        className='app__flex'
                      >
                        <AiFillGithub />
                      </motion.div>
                    </a>
                  )}
                </motion.div>
              </div>

              <div className='app__work-content app__flex'>
                <h4 className='bold-text'>{work.title}</h4>
                <p className='p-text' style={{ marginTop: 10 }}>
                  {work.description}
                </p>

                {primaryTag && (
                  <div className='app__work-tag app__flex'>
                    <p className='p-text'>{primaryTag}</p>
                  </div>
                )}

                <div className='app__work-rounded-tags' style={{ marginTop: 10 }}>
                  {otherTags
                    .filter((tag) => tag !== 'All')
                    .map((tag) => (
                      <p key={tag} className='app__work-tag-rounded p-text'>
                        {tag}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          )
        })}
      </motion.div>
    </>
  )
}

export default AppWrap(MotionWrap(Work, 'app__works'), 'work', 'app__primarybg')
