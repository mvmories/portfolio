import { render, screen, waitFor } from '@testing-library/react'
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
  it('does not render the All tag as a chip', async () => {
    render(<Work />)

    await screen.findByRole('heading', { name: 'PowerByJS' })
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.queryByText('All')).not.toBeInTheDocument()
  })

  it('explains why the list is short', async () => {
    render(<Work />)

    await waitFor(() => expect(screen.getByText(/covered by NDA/i)).toBeInTheDocument())
  })
})
