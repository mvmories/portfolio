import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi'

import { useTheme } from '@/lib/useTheme'
import './ThemeToggle.scss'

/**
 * A two-state switch rather than a three-way light/dark/system control.
 *
 * Until it is pressed the site follows the OS, so "system" is already the
 * default and does not need to occupy a third of a control most people press
 * once. Pressing it is what turns an implicit preference into a stored one.
 */
const ThemeToggle = () => {
  const { theme, toggle } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type='button'
      className='theme-toggle'
      onClick={toggle}
      // The label describes the outcome, not the current state - a button
      // announced as "dark theme" leaves it ambiguous whether that is what it
      // does or what is already on.
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      <span className='theme-toggle__icons' aria-hidden='true'>
        <HiOutlineSun className='theme-toggle__icon theme-toggle__icon--sun' />
        <HiOutlineMoon className='theme-toggle__icon theme-toggle__icon--moon' />
      </span>
    </button>
  )
}

export default ThemeToggle
