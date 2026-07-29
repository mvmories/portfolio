import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

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
  it('renders every section landmark without crashing', async () => {
    render(<App />)

    for (const id of ['home', 'about', 'work', 'skills', 'testimonials', 'contact']) {
      expect(document.getElementById(id)).toBeInTheDocument()
    }
  })

  it('renders the contact form', () => {
    render(<App />)
    expect(screen.getAllByPlaceholderText('Your Name').length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: /send message/i }).length).toBeGreaterThan(0)
  })
})

// Imported after the mock so the stub is in place.
const { default: App } = await import('./App')
