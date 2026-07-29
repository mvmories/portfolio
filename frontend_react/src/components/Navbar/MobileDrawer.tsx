
import { createPortal } from 'react-dom'
import { HiX } from 'react-icons/hi'
import { HiOutlineDocumentText } from 'react-icons/hi2'

import { SECTIONS } from '@/constants/sections'
import type { Cv } from '@/lib/useCv'
import { useDialog } from '@/lib/useDialog'
import type { SectionId } from '@/types/sanity'

interface Props {
  active: SectionId
  cv: Cv | null
  /** True while the close animation plays, just before unmounting. */
  closing: boolean
  onClose: () => void
}

/**
 * Rendered through a portal rather than inline in the header. The header is a
 * fixed, z-indexed element, so it forms a stacking context and a containing
 * block - a `position: fixed` overlay nested inside it is sized against the
 * header rather than the viewport. Escaping to <body> makes "cover the screen"
 * mean what it says.
 *
 * The transitions are CSS rather than Framer because AnimatePresence cannot
 * see through a portal: it has no child to hold on to, so exit animations
 * silently never run. CSS keyframes driven by a `closing` flag are honest about
 * what is happening and cost no JavaScript.
 */
const MobileDrawer = ({ active, cv, closing, onClose }: Props) => {
  const drawerRef = useDialog<HTMLDivElement>(true, onClose)
  const closingClass = closing ? ' is-closing' : ''

  return createPortal(
    <>
      <div className={`app__navbar-scrim${closingClass}`} onClick={onClose} />

      <div
        id='app__navbar-drawer'
        className={`app__navbar-drawer${closingClass}`}
        ref={drawerRef}
        role='dialog'
        aria-modal='true'
        aria-label='Site menu'
      >
        <button
          type='button'
          className='app__navbar-close'
          aria-label='Close menu'
          onClick={onClose}
        >
          <HiX aria-hidden='true' />
        </button>

        <nav aria-label='Site'>
          <ul>
            {SECTIONS.map((item) => (
              <li key={item}>
                <a
                  href={`#${item}`}
                  className={active === item ? 'is-active' : undefined}
                  aria-current={active === item ? 'page' : undefined}
                  onClick={onClose}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {cv && (
          <a
            className='app__navbar-drawer-cv'
            href={cv.viewUrl}
            target='_blank'
            rel='noopener noreferrer'
            onClick={onClose}
          >
            <HiOutlineDocumentText aria-hidden='true' />
            <span>{cv.label}</span>
          </a>
        )}
      </div>
    </>,
    document.body,
  )
}

export default MobileDrawer
