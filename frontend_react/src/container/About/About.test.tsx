import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { FALLBACK_ABOUT } from '@/lib/useAboutSection'

vi.mock('@/lib/client', () => ({
  safeFetch: () => Promise.resolve(null),
  urlFor: () => ({
    width: () => ({
      height: () => ({
        fit: () => ({ auto: () => ({ quality: () => ({ url: () => 'https://img.test/x.png' }) }) }),
      }),
    }),
  }),
}))

vi.mock('@/wrapper', () => ({
  AppWrap: (Component: React.ComponentType) => Component,
  MotionWrap: (Component: React.ComponentType) => Component,
}))

const { default: About } = await import('@/container/About/About')

describe('About', () => {
  it('renders the fallback narrative when Sanity has nothing published', () => {
    render(<About />)

    expect(screen.getByText(FALLBACK_ABOUT.narrative)).toBeInTheDocument()
  })

  /**
   * The narrative ends on the AI claim, which was for a long time the only
   * sentence on the page with no evidence anywhere behind it. The link to the
   * case study is what closed that, so it is worth a test: losing it would be
   * silent, and the section would go back to asserting something it cannot
   * support.
   */
  it('links the AI claim to the case study that backs it', () => {
    render(<About />)

    const link = screen.getByRole('link', { name: /the ai part, in detail/i })

    expect(link).toHaveAttribute('href', '/factory')
  })

  it('renders a figure for every stat', () => {
    render(<About />)

    for (const stat of FALLBACK_ABOUT.stats) {
      expect(screen.getByText(stat.value)).toBeInTheDocument()
      expect(screen.getByText(stat.label)).toBeInTheDocument()
    }
  })
})
