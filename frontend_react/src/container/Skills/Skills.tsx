import { Fragment, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import ReactTooltip from 'react-tooltip'

import { AppWrap, MotionWrap } from '@/wrapper'
import { safeFetch, urlFor } from '@/lib/client'
import type { Experience, Skill } from '@/types/sanity'
import './Skills.scss'

const Skills = () => {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [skills, setSkills] = useState<Skill[]>([])

  useEffect(() => {
    safeFetch<Experience[]>('*[_type == "experiences"]', []).then(setExperiences)
    safeFetch<Skill[]>('*[_type == "skills"]', []).then(setSkills)
  }, [])

  const sortedExperiences = useMemo(
    () => [...experiences].sort((a, b) => Number(b.year) - Number(a.year)),
    [experiences]
  )

  return (
    <>
      <h2 className='head-text'>Skills & Experiences</h2>
      <h6 className='p-text'>Hover over the experiences to see their descriptions</h6>

      <div className='app__skills-container'>
        <motion.div className='app__skills-list'>
          {skills.map((skill) => (
            <motion.div
              whileInView={{ opacity: [0, 1] }}
              transition={{ duration: 0.5 }}
              className='app__skills-item app__flex'
              key={skill._id}
            >
              <div className='app__flex' style={{ backgroundColor: skill.bgColor }}>
                <img
                  className='app__skills-item-image'
                  src={urlFor(skill.icon).width(90).auto('format').quality(80).url()}
                  alt={skill.name}
                  width={45}
                  height={45}
                  loading='lazy'
                  decoding='async'
                />
              </div>
              <p className='p-text'>{skill.name}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className='app__skills-exp'>
          {sortedExperiences.map((experience) => (
            <motion.div className='app__skills-exp-item' key={experience._id}>
              <div className='app__skills-exp-year'>
                <p className='bold-text'>{experience.year}</p>
              </div>
              <motion.div className='app__skills-exp-works'>
                {experience.works?.map((work) => {
                  const uniqueWorkId = `${experience._id}-${work.name}`
                  return (
                    <Fragment key={uniqueWorkId}>
                      <motion.div
                        whileInView={{ opacity: [0, 1] }}
                        transition={{ duration: 0.5 }}
                        className='app__skills-exp-work'
                        data-tip
                        data-for={uniqueWorkId}
                      >
                        <h4 className='bold-text'>{work.name}</h4>
                        <p className='p-text'>{work.company}</p>
                      </motion.div>
                      <ReactTooltip
                        id={uniqueWorkId}
                        effect='solid'
                        arrowColor='#fff'
                        className='skills-tooltip'
                      >
                        {work.desc}
                      </ReactTooltip>
                    </Fragment>
                  )
                })}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}

export default AppWrap(MotionWrap(Skills, 'app__skills'), 'skills', 'app__whitebg')
