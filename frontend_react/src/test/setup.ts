import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// jsdom implements neither; framer-motion's whileInView needs the first.
vi.stubGlobal(
  'IntersectionObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
    root = null
    rootMargin = ''
    thresholds = []
  }
)

vi.stubGlobal(
  'ResizeObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
)

window.scrollTo = vi.fn()
