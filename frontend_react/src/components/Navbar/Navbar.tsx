import { useState } from 'react'
import { HiMenuAlt4, HiX } from 'react-icons/hi'
import { motion, AnimatePresence } from 'framer-motion'

import { images } from '@/constants'
import { SECTIONS } from '@/constants/sections'
import './Navbar.scss'

const Navbar = () => {
  const [toggle, setToggle] = useState(false)

  return (
    <nav className='app__navbar'>
      <div className='app__navbar-logo'>
        <img src={images.logo} alt='Miguel Vilhena logo' width={90} height={40} />
      </div>

      <ul className='app__navbar-links'>
        {SECTIONS.map((item) => (
          <li className='app__flex p-text2' key={`link-${item}`}>
            <div />
            <a href={`#${item}`}>{item}</a>
          </li>
        ))}
      </ul>

      <div className='app__navbar-menu'>
        <button type='button' aria-label='Open menu' aria-expanded={toggle} onClick={() => setToggle(true)}>
          <HiMenuAlt4 />
        </button>

        <AnimatePresence>
          {toggle && (
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
            >
              <button type='button' aria-label='Close menu' onClick={() => setToggle(false)}>
                <HiX />
              </button>
              <ul>
                {SECTIONS.map((item) => (
                  <li key={item}>
                    <a href={`#${item}`} onClick={() => setToggle(false)}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar
