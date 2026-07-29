import { useCallback, useEffect, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

/**
 * Theme is stored as an explicit choice or not at all. There is deliberately no
 * `'system'` value: the absence of the key *is* "follow the system", which lets
 * the CSS express it as `:root:not([data-theme])` and means the OS preference
 * keeps working with no JavaScript involved at all.
 */
function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    // Safari in private mode throws on localStorage access rather than
    // returning null. A visitor who cannot persist a choice should still get a
    // working toggle for the session.
    return null
  }
}

/**
 * Returns null where `matchMedia` is unavailable - jsdom, older browsers, and
 * any server-side render. Every caller then falls back to light, which is the
 * same default the CSS uses when the media query cannot match.
 */
function systemQuery(): MediaQueryList | null {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null
}

function systemTheme(): Theme {
  return systemQuery()?.matches ? 'dark' : 'light'
}

/**
 * `useSyncExternalStore` rather than `useState` because the theme lives outside
 * React - it is an attribute on <html> set by an inline script before the first
 * paint, and it can also change from the OS. This keeps every subscriber in
 * step with the DOM instead of with a second copy of the truth.
 */
function subscribe(onChange: () => void) {
  const media = systemQuery()
  media?.addEventListener('change', onChange)
  window.addEventListener('storage', onChange)
  return () => {
    media?.removeEventListener('change', onChange)
    window.removeEventListener('storage', onChange)
  }
}

function getSnapshot(): Theme {
  return readStored() ?? systemTheme()
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => 'light' as Theme)

  // Keep the attribute in step with the resolved value. The inline script in
  // index.html has already done this for the stored case before first paint;
  // this covers changes made during the session.
  useEffect(() => {
    const stored = readStored()
    if (stored) document.documentElement.dataset.theme = stored
    else delete document.documentElement.dataset.theme
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Ignored - the attribute below still applies the change for this session.
    }
    document.documentElement.dataset.theme = next
    // localStorage writes do not fire `storage` in the tab that made them, so
    // nudge subscribers in this tab directly.
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }))
  }, [])

  const toggle = useCallback(() => {
    setTheme(getSnapshot() === 'dark' ? 'light' : 'dark')
  }, [setTheme])

  return { theme, setTheme, toggle }
}
