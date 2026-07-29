import { motion } from 'framer-motion'

import { AppWrap, MotionWrap } from '@/wrapper'
import { urlFor } from '@/lib/client'
import { useSkills } from '@/lib/useSkills'
import './Skills.scss'

const Skills = () => {
  const skills = useSkills()

  return (
    <>
      <h2 className='head-text'>
        Tools I <span>work with</span>
      </h2>

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
      </div>
    </>
  )
}

export default AppWrap(MotionWrap(Skills, 'app__skills'), 'skills', 'app__whitebg')
