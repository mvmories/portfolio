import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ReactTooltip from 'react-tooltip'

import { AppWrap, MotionWrap } from '../../wrapper'
import { urlFor, client } from '../../client'
import './Skills.scss'

const Skills = () => {
  const [experiences, setExperiences] = useState([])
  const [skills, setSkills] = useState([])

  useEffect(() => {
    const query = '*[_type == "experiences"]'
    const skillsQuery = '*[_type == "skills"]'

    client.fetch(query).then((data) => {
      setExperiences(data)
    })

    client.fetch(skillsQuery).then((data) => {
      setSkills(data)
    })
  }, [])

  return (
    <>
      <h2 className='head-text'>Skills & Experiences</h2>
      <h6 className='p-text'>Hover over the experiences to see their descriptions</h6>

      <div className='app__skills-container'>
        <motion.div className='app__skills-list'>
          {skills.map((skill, index) => (
            <motion.div
              whileInView={{ opacity: [0, 1] }}
              transition={{ duration: 0.5 }}
              className='app__skills-item app__flex'
              key={index}
            >
              <div
                className='app__flex'
                style={{ backgroundColor: skill.bgColor }}
              >
                <img
                  className='app__skills-item-image'
                  src={urlFor(skill.icon)}
                  alt={skill.name}
                />
              </div>
              <p className='p-text'>{skill.name}</p>
            </motion.div>
          ))}
        </motion.div>
        <div className='app__skills-exp'>
          {experiences
            .sort((a, b) => b.year - a.year)
            .map((experience) => (
              <motion.div
                className='app__skills-exp-item'
                key={experience.year}
              >
                <div className='app__skills-exp-year'>
                  <p className='bold-text'>{experience.year}</p>
                </div>
                <motion.div className='app__skills-exp-works'>
                  {experience.works.map((work) => {
                    const uniqueWorkId = `${experience._id}-${work.name}`
                    return (
                      <>
                        <motion.div
                          whileInView={{ opacity: [0, 1] }}
                          transition={{ duration: 0.5 }}
                          className='app__skills-exp-work'
                          data-tip
                          data-for={uniqueWorkId}
                          key={uniqueWorkId}
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
                      </>
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
