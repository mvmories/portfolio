import { useCallback, useEffect, useState } from 'react'
import { HiMenuAlt4 } from 'react-icons/hi'
import { HiOutlineDocumentText } from 'react-icons/hi2'

import MobileDrawer from '@/components/Navbar/MobileDrawer'
import ThemeToggle from '@/components/ThemeToggle'
import { images } from '@/constants'
import { SECTIONS } from '@/constants/sections'
import { useActiveSection } from '@/lib/useActiveSection'
import { useCv } from '@/lib/useCv'
import './Navbar.scss'

/** Far enough that the bar only reacts to a deliberate scroll. */
const SCROLL_THRESHOLD = 24

/** Must match the drawer's close keyframes in Navbar.scss. */
const CLOSE_DURATION = 180

type DrawerState = 'closed' | 'open' | 'closing'

const Navbar = () => {
  // Three states rather than a boolean, because the drawer has to stay mounted
  // long enough to animate out.
  const [drawer, setDrawer] = useState<DrawerState>('closed')
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection()
  const cv = useCv()

  const close = useCallback(() => {
    setDrawer((state) => (state === 'open' ? 'closing' : state))
  }, [])

  useEffect(() => {
    if (drawer !== 'closing') return
    const timer = setTimeout(() => setDrawer('closed'), CLOSE_DURATION)
    return () => clearTimeout(timer)
  }, [drawer])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`app__navbar${scrolled ? ' is-scrolled' : ''}`}>
      <a className='app__navbar-logo' href='#home' aria-label='Back to top'>
        <img src={images.logo} alt='Miguel Vilhena' width={90} height={30} />
      </a>

      <nav aria-label='Primary'>
        <ul className='app__navbar-links'>
          {SECTIONS.map((item) => (
            <li key={`link-${item}`}>
              <a
                href={`#${item}`}
                className={active === item ? 'is-active' : undefined}
                aria-current={active === item ? 'page' : undefined}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className='app__navbar-actions'>
        <ThemeToggle />

        {cv && (
          <a
            className='app__navbar-cv'
            href={cv.viewUrl}
            target='_blank'
            rel='noopener noreferrer'
            title={cv.tooltip}
          >
            <HiOutlineDocumentText aria-hidden='true' />
            <span>CV</span>
          </a>
        )}

        <button
          type='button'
          className='app__navbar-toggle'
          aria-label='Open menu'
          aria-expanded={drawer === 'open'}
          aria-controls='app__navbar-drawer'
          onClick={() => setDrawer('open')}
        >
          <HiMenuAlt4 aria-hidden='true' />
        </button>
      </div>

      {drawer !== 'closed' && (
        <MobileDrawer
          active={active}
          cv={cv}
          closing={drawer === 'closing'}
          onClose={close}
        />
      )}
    </header>
  )
}

export default Navbar
