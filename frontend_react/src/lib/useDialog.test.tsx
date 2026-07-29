import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useDialog } from './useDialog'

function Harness({ onClose, initiallyOpen = true }: { onClose: () => void; initiallyOpen?: boolean }) {
  const [open, setOpen] = useState(initiallyOpen)
  const ref = useDialog<HTMLDivElement>(open, onClose)

  return (
    <>
      <button type='button' onClick={() => setOpen(true)}>
        trigger
      </button>
      {open && (
        <div ref={ref}>
          <button type='button'>first</button>
          <button type='button'>second</button>
          <button type='button' onClick={() => setOpen(false)}>
            last
          </button>
        </div>
      )}
    </>
  )
}

afterEach(() => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
})

describe('useDialog', () => {
  it('moves focus into the dialog on open', () => {
    render(<Harness onClose={vi.fn()} />)

    expect(screen.getByText('first')).toHaveFocus()
  })

  it('locks background scrolling while open and restores it after', async () => {
    const user = userEvent.setup()
    render(<Harness onClose={vi.fn()} />)

    expect(document.body.style.overflow).toBe('hidden')

    await user.click(screen.getByText('last'))

    expect(document.body.style.overflow).toBe('')
  })

  it('closes on Escape', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<Harness onClose={onClose} />)

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('wraps Tab from the last element back to the first', async () => {
    const user = userEvent.setup()
    render(<Harness onClose={vi.fn()} />)

    screen.getByText('last').focus()
    await user.tab()

    expect(screen.getByText('first')).toHaveFocus()
  })

  it('wraps Shift+Tab from the first element to the last', async () => {
    const user = userEvent.setup()
    render(<Harness onClose={vi.fn()} />)

    await user.tab({ shift: true })

    expect(screen.getByText('last')).toHaveFocus()
  })

  it('returns focus to whatever was focused before it opened', async () => {
    const user = userEvent.setup()
    render(<Harness onClose={vi.fn()} initiallyOpen={false} />)

    const trigger = screen.getByText('trigger')
    await user.click(trigger)
    expect(screen.getByText('first')).toHaveFocus()

    await user.click(screen.getByText('last'))

    expect(trigger).toHaveFocus()
  })
})
