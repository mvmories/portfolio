import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useHashLanding } from './useHashLanding'

const mountSection = (id: string) => {
  const el = document.createElement('section')
  el.id = id
  el.scrollIntoView = vi.fn()
  document.body.appendChild(el)
  return el
}

afterEach(() => {
  document.body.innerHTML = ''
  window.location.hash = ''
  vi.useRealTimers()
})

describe('useHashLanding', () => {
  // The bug this exists to prevent: React mounts after the browser has already
  // tried and failed to reach the fragment, so the visitor silently lands on
  // the hero instead of the section they asked for.
  it('scrolls to the section named in the hash', () => {
    const contact = mountSection('contact')
    window.location.hash = '#contact'

    renderHook(() => useHashLanding())

    expect(contact.scrollIntoView).toHaveBeenCalled()
  })

  it('ignores a hash that is not a known section', () => {
    const other = mountSection('not-a-section')
    window.location.hash = '#not-a-section'

    renderHook(() => useHashLanding())

    expect(other.scrollIntoView).not.toHaveBeenCalled()
  })

  it('does nothing without a hash', () => {
    const contact = mountSection('contact')

    renderHook(() => useHashLanding())

    expect(contact.scrollIntoView).not.toHaveBeenCalled()
  })

  // Realignment exists because sections keep growing as content and images
  // arrive, but it must never fight someone who has started reading.
  it('stops realigning once the visitor scrolls', () => {
    const contact = mountSection('contact')
    window.location.hash = '#contact'

    renderHook(() => useHashLanding())
    const initial = vi.mocked(contact.scrollIntoView).mock.calls.length

    window.dispatchEvent(new Event('wheel'))
    window.dispatchEvent(new Event('resize'))

    expect(contact.scrollIntoView).toHaveBeenCalledTimes(initial)
  })
})
