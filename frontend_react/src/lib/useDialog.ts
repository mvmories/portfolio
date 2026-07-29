import { useEffect, useRef } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Gives an open overlay the three behaviours a keyboard or screen-reader user
 * expects and a plain `{open && <div/>}` does not provide: focus moves into it,
 * Tab cannot escape it, and Escape closes it. Also locks background scrolling,
 * which is otherwise the most obvious sign an overlay is not a real dialog.
 *
 * Returns the ref to attach to the overlay element.
 */
export function useDialog<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!open) return

    const node = ref.current
    const previouslyFocused = document.activeElement as HTMLElement | null

    // Compensating for the scrollbar keeps the page from shifting sideways the
    // moment the overlay opens.
    const { overflow, paddingRight } = document.body.style
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`

    // Queried on every keypress rather than cached: the contents can change
    // while the overlay is open.
    const focusable = () =>
      node ? Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)) : []

    focusable()[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const items = focusable()
      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
      // Returning focus to the trigger is what makes the overlay feel like part
      // of the page rather than somewhere the user was dropped.
      previouslyFocused?.focus()
    }
  }, [open, onClose])

  return ref
}
