import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { SECTIONS } from '@/constants/sections'
import { useActiveSection } from './useActiveSection'

type Callback = (entries: { target: { id: string }; isIntersecting: boolean; intersectionRatio: number }[]) => void

/** Captures the observer callback so tests can drive intersections directly. */
function mockObserver() {
  const state: { callback: Callback | null; observed: string[] } = { callback: null, observed: [] }

  class FakeObserver {
    constructor(callback: Callback) {
      state.callback = callback
    }
    observe(el: HTMLElement) {
      state.observed.push(el.id)
    }
    disconnect() {}
  }

  vi.stubGlobal('IntersectionObserver', FakeObserver)
  return state
}

function emit(state: ReturnType<typeof mockObserver>, ratios: Record<string, number>) {
  act(() => {
    state.callback?.(
      Object.entries(ratios).map(([id, ratio]) => ({
        target: { id },
        isIntersecting: ratio > 0,
        intersectionRatio: ratio,
      })),
    )
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('useActiveSection', () => {
  function mountSections() {
    document.body.innerHTML = SECTIONS.map((id) => `<section id="${id}"></section>`).join('')
  }

  it('starts on the first section', () => {
    mountSections()
    mockObserver()

    const { result } = renderHook(() => useActiveSection())

    expect(result.current).toBe(SECTIONS[0])
  })

  it('observes every section', () => {
    mountSections()
    const state = mockObserver()

    renderHook(() => useActiveSection())

    expect(state.observed).toEqual([...SECTIONS])
  })

  it('picks the section occupying most of the viewport', () => {
    mountSections()
    const state = mockObserver()
    const { result } = renderHook(() => useActiveSection())

    emit(state, { home: 0.3, about: 0.7 })

    expect(result.current).toBe('about')
  })

  it('remembers ratios reported in earlier callbacks', () => {
    mountSections()
    const state = mockObserver()
    const { result } = renderHook(() => useActiveSection())

    emit(state, { about: 0.8 })
    // A later callback only carries what changed; `about` must still win.
    emit(state, { work: 0.2 })

    expect(result.current).toBe('about')
  })

  it('keeps the last section when nothing is intersecting', () => {
    mountSections()
    const state = mockObserver()
    const { result } = renderHook(() => useActiveSection())

    emit(state, { work: 0.9 })
    emit(state, { work: 0 })

    expect(result.current).toBe('work')
  })

  it('falls back to the first section without IntersectionObserver', () => {
    mountSections()
    vi.stubGlobal('IntersectionObserver', undefined)

    const { result } = renderHook(() => useActiveSection())

    expect(result.current).toBe(SECTIONS[0])
  })
})
