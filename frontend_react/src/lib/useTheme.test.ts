import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useTheme } from './useTheme'

/** Installs a `matchMedia` stub, which jsdom does not provide. */
function mockSystemDark(matches: boolean) {
  const listeners = new Set<() => void>()
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches,
      addEventListener: (_: string, fn: () => void) => listeners.add(fn),
      removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
    })),
  )
  return listeners
}

afterEach(() => {
  vi.unstubAllGlobals()
  localStorage.clear()
  delete document.documentElement.dataset.theme
})

describe('useTheme', () => {
  it('follows the system when nothing is stored', () => {
    mockSystemDark(true)
    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
    // The attribute stays absent so the CSS keeps honouring the OS preference.
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })

  it('falls back to light where matchMedia is unavailable', () => {
    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')
  })

  it('prefers an explicit stored choice over the system', () => {
    mockSystemDark(true)
    localStorage.setItem('theme', 'light')
    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('ignores an unrecognised stored value', () => {
    mockSystemDark(true)
    localStorage.setItem('theme', 'sepia')
    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
  })

  it('toggles, persists, and updates the attribute in the same tab', () => {
    mockSystemDark(false)
    const { result } = renderHook(() => useTheme())

    act(() => result.current.toggle())

    expect(result.current.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')

    act(() => result.current.toggle())

    expect(result.current.theme).toBe('light')
  })

  it('re-reads when the OS preference changes', () => {
    const listeners = mockSystemDark(false)
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')

    mockSystemDark(true)
    act(() => listeners.forEach((fn) => fn()))

    expect(result.current.theme).toBe('dark')
  })

  it('still toggles when localStorage is unavailable', () => {
    mockSystemDark(false)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('denied')
    })
    const { result } = renderHook(() => useTheme())

    act(() => result.current.toggle())

    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
