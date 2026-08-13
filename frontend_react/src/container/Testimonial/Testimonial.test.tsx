import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Testimonial as TestimonialDoc } from '@/types/sanity'

const safeFetch = vi.fn()

vi.mock('@/lib/client', () => ({
  safeFetch: (...args: unknown[]) => safeFetch(...args),
  urlFor: () => ({
    width: () => ({
      height: () => ({
        fit: () => ({ auto: () => ({ quality: () => ({ url: () => 'https://img.test/x.png' }) }) }),
      }),
      auto: () => ({ quality: () => ({ url: () => 'https://img.test/x.png' }) }),
    }),
  }),
}))

vi.mock('@/wrapper', () => ({
  AppWrap: (Component: React.ComponentType) => Component,
  MotionWrap: (Component: React.ComponentType) => Component,
}))

const { default: Testimonial } = await import('@/container/Testimonial/Testimonial')

const quote = (overrides: Partial<TestimonialDoc> & { name: string }): TestimonialDoc => ({
  _id: `testimonial-${overrides.name}`,
  _type: 'testimonials',
  _createdAt: '2024-01-01T00:00:00Z',
  _updatedAt: '2024-01-01T00:00:00Z',
  _rev: 'rev-1',
  company: 'Expereo',
  role: 'Backend Developer',
  feedback: `${overrides.name} said something specific about the work.`,
  ...overrides,
})

const FEATURED = [
  quote({
    name: 'Marcos Miani',
    company: 'ABN AMRO',
    role: 'Front-end Community Lead',
    workedTogetherAt: 'Sytac',
    featured: true,
    linkedInUrl: 'https://linkedin.test/marcos',
  }),
  quote({ name: 'Aleksandr Morozov', featured: true }),
]

const REST = [quote({ name: 'Kyrylo Piddubnyi' }), quote({ name: 'Yuliia Andrieieva' })]

const mockData = (testimonials: TestimonialDoc[]) => {
  safeFetch.mockImplementation((query: string) =>
    Promise.resolve(query.includes('testimonials') ? testimonials : []),
  )
}

describe('Testimonial', () => {
  beforeEach(() => {
    safeFetch.mockReset()
    mockData([...FEATURED, ...REST])
  })

  it('shows the featured quotes with no interaction', async () => {
    render(<Testimonial />)

    expect(await screen.findByText(/Marcos Miani said something/)).toBeInTheDocument()
    expect(screen.getByText(/Aleksandr Morozov said something/)).toBeInTheDocument()
  })

  // The projection once omitted workedTogetherAt, so every quote from someone
  // who had since changed employer silently claimed Miguel worked at their new
  // company. Component tests pass props directly and cannot catch that, so the
  // query itself has to be asserted.
  it('asks Sanity for every field the card renders', async () => {
    render(<Testimonial />)

    await screen.findByText(/Marcos Miani said something/)
    const query = safeFetch.mock.calls.map((call) => String(call[0])).find((q) => q.includes('testimonials')) ?? ''
    for (const field of ['name', 'role', 'company', 'workedTogetherAt', 'feedback', 'imgurl', 'linkedInUrl', 'featured', 'sortOrder']) {
      expect(query).toContain(field)
    }
  })

  // The section used to be a one-at-a-time slider, so a visitor who never
  // pressed an arrow concluded there was a single recommendation.
  it('renders no slider controls', async () => {
    render(<Testimonial />)

    await screen.findByText(/Marcos Miani said something/)
    expect(screen.queryByRole('button', { name: /previous testimonial/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /next testimonial/i })).not.toBeInTheDocument()
  })

  it('hides the unfeatured quotes until asked', async () => {
    render(<Testimonial />)

    await screen.findByText(/Marcos Miani said something/)
    expect(screen.queryByText(/Kyrylo Piddubnyi said something/)).not.toBeInTheDocument()
  })

  // The count is a claim in its own right, so it has to come from the data.
  it('reveals the rest, counting them honestly', async () => {
    render(<Testimonial />)

    const button = await screen.findByRole('button', { name: 'Read all 4 recommendations' })
    await userEvent.click(button)

    expect(screen.getByText(/Kyrylo Piddubnyi said something/)).toBeInTheDocument()
    expect(screen.getByText(/Yuliia Andrieieva said something/)).toBeInTheDocument()
    await waitFor(() => expect(button).not.toBeInTheDocument())
  })

  it('moves focus to the first revealed quote', async () => {
    render(<Testimonial />)

    await userEvent.click(await screen.findByRole('button', { name: /Read all/ }))

    const revealed = screen.getByText(/Kyrylo Piddubnyi said something/).closest('li')
    await waitFor(() => expect(revealed).toHaveFocus())
  })

  it('offers no disclosure when everything is already featured', async () => {
    mockData(FEATURED)
    render(<Testimonial />)

    await screen.findByText(/Marcos Miani said something/)
    expect(screen.queryByRole('button', { name: /Read all/ })).not.toBeInTheDocument()
  })

  // An unattributable quote is worth little, so the link is the point.
  it('links the name to LinkedIn when there is a profile', async () => {
    render(<Testimonial />)

    const link = await screen.findByRole('link', { name: 'Marcos Miani' })
    expect(link).toHaveAttribute('href', 'https://linkedin.test/marcos')
  })

  it('renders a name without a profile as plain text', async () => {
    render(<Testimonial />)

    await screen.findByText(/Aleksandr Morozov said something/)
    expect(screen.queryByRole('link', { name: 'Aleksandr Morozov' })).not.toBeInTheDocument()
    expect(screen.getByText('Aleksandr Morozov')).toBeInTheDocument()
  })

  it('attributes every quote with a role and company', async () => {
    render(<Testimonial />)

    expect(await screen.findByText('Front-end Community Lead, ABN AMRO')).toBeInTheDocument()
  })

  // Without this line the reader assumes the work happened at whichever company
  // the person is at now, which is a claim the site cannot make.
  it('names where they actually worked together when it differs', async () => {
    render(<Testimonial />)

    expect(await screen.findByText('Worked together at Sytac')).toBeInTheDocument()
  })

  it('omits that line when they are still at the same company', async () => {
    render(<Testimonial />)

    await screen.findByText(/Aleksandr Morozov said something/)
    expect(screen.queryByText('Worked together at Expereo')).not.toBeInTheDocument()
  })

  // Every quote on the page is clipped, so the unabridged versions need an
  // address. LinkedIn gives recommendations no per-quote URL, only this tab.
  //
  // The exact profile is asserted on purpose. A hand-typed LinkedIn URL once
  // shipped pointing at a different Miguel Vilhena, which sends a recruiter to
  // a stranger's profile. It is derived from site settings now, and pinned here.
  it('links out to the real profile, not a guessed one', async () => {
    render(<Testimonial />)

    const link = await screen.findByRole('link', { name: /Read them in full on LinkedIn/ })
    expect(link).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/miguel-vilhena-215aa590/details/recommendations/',
    )
  })

  // Recommendations arrive without a photo more often than not.
  it('falls back to initials when there is no photo', async () => {
    render(<Testimonial />)

    await screen.findByText(/Marcos Miani said something/)
    expect(screen.getByText('MM')).toBeInTheDocument()
  })

  it('falls back to the first few when nothing is flagged as featured', async () => {
    mockData(REST)
    render(<Testimonial />)

    expect(await screen.findByText(/Kyrylo Piddubnyi said something/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Read all/ })).not.toBeInTheDocument()
  })
})
