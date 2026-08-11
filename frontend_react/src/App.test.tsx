import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SECTIONS } from '@/constants/sections'

// The Sanity client is network-bound; stub it so the smoke test stays offline.
vi.mock('@/lib/client', () => ({
  client: { fetch: vi.fn().mockResolvedValue([]) },
  safeFetch: vi.fn().mockResolvedValue([]),
  urlFor: () => ({
    width: () => ({
      height: () => ({
        fit: () => ({ auto: () => ({ quality: () => ({ url: () => '/stub.png' }) }) }),
      }),
      auto: () => ({ quality: () => ({ url: () => '/stub.png' }) }),
    }),
  }),
}))

describe('App', () => {
  // Driven by SECTIONS rather than a copy of it, so a section that is added or
  // removed without a matching landmark fails here instead of drifting silently.
  it('renders a landmark for every section in the navigation', async () => {
    render(<App />)

    for (const id of SECTIONS) {
      expect(document.getElementById(id)).toBeInTheDocument()
    }

    // Let the stubbed Sanity fetches settle so state updates stay inside act().
    await waitFor(() => expect(screen.getAllByText(/testimonials/i).length).toBeGreaterThan(0))
  })

  it('renders the contact form', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('Your Name').length).toBeGreaterThan(0)
      expect(screen.getAllByRole('button', { name: /send message/i }).length).toBeGreaterThan(0)
    })
  })
})

// Imported after the mock so the stub is in place.
const { default: App } = await import('./App')
