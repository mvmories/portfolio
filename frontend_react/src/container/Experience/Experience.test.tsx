import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ExperienceFields } from '@/types/sanity'

const safeFetch = vi.fn()

vi.mock('@/lib/client', () => ({
  safeFetch: (...args: unknown[]) => safeFetch(...args),
  urlFor: () => ({
    width: () => ({
      height: () => ({ auto: () => ({ quality: () => ({ url: () => 'https://img.test/x.png' }) }) }),
      auto: () => ({ quality: () => ({ url: () => 'https://img.test/x.png' }) }),
    }),
  }),
}))

// The section wrappers add scroll animation and an id; neither is under test
// here and both need a real layout to behave.
vi.mock('@/wrapper', () => ({
  AppWrap: (Component: React.ComponentType) => Component,
  MotionWrap: (Component: React.ComponentType) => Component,
}))

const { default: Experience } = await import('@/container/Experience/Experience')

const IKEA: ExperienceFields = {
  _id: 'experience-ikea',
  _type: 'experience',
  role: 'Software Engineer',
  company: 'IKEA',
  location: 'Amsterdam, NL',
  employmentType: 'full-time',
  startDate: '2023-08-01',
  current: true,
  summary: 'Designing and shipping software across IKEA.',
  highlights: ['Deliver high-quality software', 'Champion the right tooling'],
  techStack: ['React', 'TypeScript'],
}

const EXPEREO: ExperienceFields = {
  _id: 'experience-expereo',
  _type: 'experience',
  role: 'Software Engineer',
  company: 'Expereo',
  startDate: '2022-01-01',
  endDate: '2023-07-01',
  summary: 'Core frontend engineer on a B2B platform.',
  highlights: ['Built the frontend in React'],
  techStack: ['React'],
}

function mockData(experiences: ExperienceFields[]) {
  safeFetch.mockImplementation((query: string) =>
    Promise.resolve(query.includes('"experience"') ? experiences : [])
  )
}

describe('Experience', () => {
  beforeEach(() => {
    safeFetch.mockReset()
  })

  it('renders roles newest first', async () => {
    mockData([EXPEREO, IKEA])
    render(<Experience />)

    const items = await screen.findAllByRole('listitem')
    // The nested highlight bullets are list items too, so match on the headings.
    const headings = screen.getAllByText(/Software Engineer/)
    expect(items.length).toBeGreaterThan(0)
    expect(headings[0].closest('li')).toHaveTextContent('IKEA')
  })

  it('shows a computed range and duration rather than stored text', async () => {
    mockData([IKEA])
    render(<Experience />)

    // The exact arithmetic is covered in dates.test.ts against an injected
    // clock; asserting it here would make the test fail with the calendar.
    const range = await screen.findByText(/Aug 2023 — Present/)
    expect(range).toHaveTextContent(/· \d+ (yrs?|mos?)/)
  })

  it('opens the most recent role so the section is never all collapsed', async () => {
    mockData([EXPEREO, IKEA])
    render(<Experience />)

    await waitFor(() => {
      const buttons = screen.getAllByRole('button', { expanded: true })
      expect(buttons).toHaveLength(1)
      expect(buttons[0]).toHaveTextContent('IKEA')
    })
  })

  it('expands and collapses on click, without any hover', async () => {
    const user = userEvent.setup()
    mockData([EXPEREO, IKEA])
    render(<Experience />)

    const expereo = await screen.findByRole('button', { name: /Expereo/ })
    expect(expereo).toHaveAttribute('aria-expanded', 'false')

    await user.click(expereo)
    expect(expereo).toHaveAttribute('aria-expanded', 'true')
    expect(await screen.findByText('Built the frontend in React')).toBeInTheDocument()

    await user.click(expereo)
    await waitFor(() => expect(expereo).toHaveAttribute('aria-expanded', 'false'))
  })

  it('is operable by keyboard', async () => {
    const user = userEvent.setup()
    mockData([EXPEREO, IKEA])
    render(<Experience />)

    const expereo = await screen.findByRole('button', { name: /Expereo/ })
    expereo.focus()
    await user.keyboard('{Enter}')
    expect(expereo).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard(' ')
    await waitFor(() => expect(expereo).toHaveAttribute('aria-expanded', 'false'))
  })

  it('points aria-controls at the panel it actually reveals', async () => {
    const user = userEvent.setup()
    mockData([EXPEREO, IKEA])
    render(<Experience />)

    const expereo = await screen.findByRole('button', { name: /Expereo/ })
    await user.click(expereo)

    const panelId = expereo.getAttribute('aria-controls')
    expect(panelId).toBeTruthy()
    const panel = document.getElementById(panelId as string)
    expect(panel).toBeTruthy()
    expect(within(panel as HTMLElement).getByText('Built the frontend in React')).toBeInTheDocument()
  })

  it('expands and collapses every role at once', async () => {
    const user = userEvent.setup()
    mockData([EXPEREO, IKEA])
    render(<Experience />)

    const toggleAll = await screen.findByRole('button', { name: 'Expand all' })
    await user.click(toggleAll)
    await waitFor(() => expect(screen.getAllByRole('button', { expanded: true })).toHaveLength(2))

    await user.click(screen.getByRole('button', { name: 'Collapse all' }))
    await waitFor(() => expect(screen.queryAllByRole('button', { expanded: true })).toHaveLength(0))
  })

  it('renders nothing when there is no data, rather than an empty rail', async () => {
    mockData([])
    const { container } = render(<Experience />)
    await waitFor(() => expect(container).toBeEmptyDOMElement())
  })

  it('does not offer to expand a role with nothing more to show', async () => {
    mockData([
      {
        _id: 'bare',
        _type: 'experience',
        role: 'Advisor',
        company: 'Somewhere',
        startDate: '2019-01-01',
        endDate: '2019-06-01',
        summary: 'A short stint.',
      },
    ])
    render(<Experience />)

    const trigger = await screen.findByRole('button', { name: /Advisor/ })
    expect(trigger).toBeDisabled()
    expect(trigger).not.toHaveAttribute('aria-controls')
  })
})
