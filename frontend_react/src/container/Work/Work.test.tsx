import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Work as WorkDoc } from '@/types/sanity'

const safeFetch = vi.fn()

vi.mock('@/lib/client', () => ({
  safeFetch: (...args: unknown[]) => safeFetch(...args),
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

const { default: Work } = await import('@/container/Work/Work')

const POWERBYJS: WorkDoc = {
  _id: 'work-powerbyjs',
  _type: 'works',
  _createdAt: '2024-01-01T00:00:00Z',
  _updatedAt: '2024-01-01T00:00:00Z',
  _rev: 'rev-1',
  title: 'PowerByJS',
  description: 'Fullstack app created for an elite personal trainer.',
  outcome: 'Enquiries doubled in the first month.',
  projectLink: 'https://powerbyjs.test',
  codeLink: 'https://github.com/test/powerbyjs',
  imgUrl: { _type: 'image', asset: { _ref: 'image-abc', _type: 'reference' } },
  tags: ['All', 'React', 'Sanity'],
}

describe('Work', () => {
  beforeEach(() => {
    safeFetch.mockReset()
    safeFetch.mockResolvedValue([POWERBYJS])
  })

  it('renders the project with its outcome', async () => {
    render(<Work />)

    expect(await screen.findByRole('heading', { name: 'PowerByJS' })).toBeInTheDocument()
    expect(screen.getByText('Enquiries doubled in the first month.')).toBeInTheDocument()
  })

  // The filter bar derived a button per tag, so a handful of projects produced
  // twenty controls filtering almost nothing. Its absence is the feature.
  it('renders no filter controls', async () => {
    render(<Work />)

    await screen.findByRole('heading', { name: 'PowerByJS' })
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  // 'All' only ever existed to make the old filter bar work.
  it('lists the stack as plain text without the All pseudo-tag', async () => {
    render(<Work />)

    await screen.findByRole('heading', { name: 'PowerByJS' })
    expect(screen.getByText('React \u00b7 Sanity')).toBeInTheDocument()
  })

  // The actions used to sit behind a hover overlay, which touch devices could
  // never reveal.
  it('shows the project links without needing hover', async () => {
    render(<Work />)

    await screen.findByRole('heading', { name: 'PowerByJS' })
    expect(screen.getByRole('link', { name: /Visit the site/ })).toHaveAttribute(
      'href',
      'https://powerbyjs.test'
    )
    expect(screen.getByRole('link', { name: /Source/ })).toBeInTheDocument()
  })

  // Both paragraphs render, and they do different jobs: the outcome is the
  // result, the description is the ownership behind it. Reducing the second to
  // a fallback hid the research and design half of the project.
  it('renders the outcome and the description together', async () => {
    render(<Work />)

    expect(await screen.findByText('Enquiries doubled in the first month.')).toBeInTheDocument()
    expect(
      screen.getByText('Fullstack app created for an elite personal trainer.')
    ).toBeInTheDocument()
  })

  it('renders a card that has no outcome yet', async () => {
    safeFetch.mockResolvedValue([{ ...POWERBYJS, outcome: undefined }])
    render(<Work />)

    expect(
      await screen.findByText('Fullstack app created for an elite personal trainer.')
    ).toBeInTheDocument()
  })

  // Pins the published document id to the case study path. The link is driven
  // by a hardcoded map, so a wrong id would not fail loudly, it would simply
  // never render the most valuable link on the page.
  it('links a project that has a case study, and demotes the site link', async () => {
    safeFetch.mockResolvedValue([{ ...POWERBYJS, _id: 'd65aa5b4-9741-4706-950e-cef1206f4605' }])
    render(<Work />)

    const caseStudy = await screen.findByRole('link', { name: /Read the case study/ })
    expect(caseStudy).toHaveAttribute('href', '/powerbyjs')
    expect(screen.getByRole('link', { name: /Visit the site/ })).toHaveClass(
      'app__work-action--secondary'
    )
  })

  /**
   * The factory card is the first entry with no site to visit and no source to
   * show, so the case study is its only action. A missing id here would leave a
   * card that links nowhere at all, which is worse than the PowerByJS case.
   */
  it('links the factory card to its case study and gives it no other action', async () => {
    safeFetch.mockResolvedValue([
      {
        ...POWERBYJS,
        _id: 'a122c9f7-25b0-4243-af82-c01a4dac9891',
        title: 'The AI Factory',
        projectLink: undefined,
        codeLink: undefined,
      },
    ])
    render(<Work />)

    const caseStudy = await screen.findByRole('link', { name: /Read the case study/ })
    expect(caseStudy).toHaveAttribute('href', '/factory')
    expect(screen.queryByRole('link', { name: /Visit the site/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Source/ })).not.toBeInTheDocument()
  })

  it('shows no case study link for a project without one', async () => {    render(<Work />)

    await screen.findByRole('heading', { name: 'PowerByJS' })
    expect(screen.queryByRole('link', { name: /case study/i })).not.toBeInTheDocument()
  })

  // The heading no longer promises a portfolio, so nothing has to apologise for
  // the length of the list. The employed work is in the experience section.
  it('is headed as side projects, with no note excusing the length', async () => {
    render(<Work />)

    await screen.findByRole('heading', { name: 'PowerByJS' })
    expect(screen.getByRole('heading', { name: /Side projects/i })).toBeInTheDocument()
    expect(screen.queryByText(/NDA/i)).not.toBeInTheDocument()
  })
})
