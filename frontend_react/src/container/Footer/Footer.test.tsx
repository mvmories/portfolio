import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { SiteSettings } from '@/types/sanity'

const settings = vi.fn()

vi.mock('@/lib/useSiteSettings', () => ({
  useSiteSettings: () => settings(),
}))

vi.mock('@/wrapper', () => ({
  AppWrap: (Component: React.ComponentType) => Component,
  MotionWrap: (Component: React.ComponentType) => Component,
}))

const { default: Footer } = await import('@/container/Footer/Footer')

const withSettings = (overrides: Partial<SiteSettings> = {}) => {
  settings.mockReturnValue({
    _type: 'siteSettings',
    contactNote: 'Open to permanent roles, and to freelance or advisory work alongside one.',
    ...overrides,
  })
}

describe('Footer', () => {
  beforeEach(() => {
    settings.mockReset()
    withSettings()
  })

  it('states what he is open to', () => {
    render(<Footer />)

    expect(screen.getByText(/Open to permanent roles/)).toBeInTheDocument()
  })

  // The email address and phone number used to sit in cards above the form.
  // Both were harvestable, and neither offered anything the form did not. A
  // regression here cannot be undone once a scraper has been past, so it is
  // asserted rather than left to review.
  it('publishes no email address or phone number', () => {
    const { container } = render(<Footer />)

    expect(container.querySelector('a[href^="mailto:"]')).toBeNull()
    expect(container.querySelector('a[href^="tel:"]')).toBeNull()
    expect(container.textContent).not.toMatch(/@[a-z0-9-]+\.[a-z]{2,}/i)
    expect(container.textContent).not.toMatch(/\+\d[\d\s()-]{7,}/)
  })

  it('offers the booking link when one is published', () => {
    withSettings({ calUrl: 'https://cal.com/miguel/20min' })
    render(<Footer />)

    const link = screen.getByRole('link', { name: /book 20 minutes/i })
    expect(link).toHaveAttribute('href', 'https://cal.com/miguel/20min')
  })

  // An unfinished booking page is worse than no booking page, so the link has
  // no fallback and must stay absent until a real URL is published.
  it('hides the booking link when none is published', () => {
    withSettings({ calUrl: undefined })
    render(<Footer />)

    expect(screen.queryByRole('link', { name: /book 20 minutes/i })).not.toBeInTheDocument()
  })

  it('keeps the form as the primary action', async () => {
    render(<Footer />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
    })
  })
})
