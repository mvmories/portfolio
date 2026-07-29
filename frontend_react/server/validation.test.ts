import { describe, expect, it, beforeEach } from 'vitest'

import { contactSchema, escapeHtml, sanitizeHeader } from './validation'
import { checkRateLimit, resetRateLimits, RATE_LIMIT } from './rate-limit'

describe('contactSchema', () => {
  const valid = {
    name: 'Miguel',
    email: 'mvmories@gmail.com',
    message: 'This is a long enough message.',
  }

  it('accepts a well-formed submission', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it('trims surrounding whitespace', () => {
    const parsed = contactSchema.parse({ ...valid, name: '  Miguel  ' })
    expect(parsed.name).toBe('Miguel')
  })

  it.each([
    ['missing name', { ...valid, name: undefined }],
    ['name too short', { ...valid, name: 'M' }],
    ['invalid email', { ...valid, email: 'not-an-email' }],
    ['message too short', { ...valid, message: 'hi' }],
    ['message too long', { ...valid, message: 'x'.repeat(2001) }],
    ['honeypot filled', { ...valid, website: 'http://spam.example' }],
  ])('rejects: %s', (_label, input) => {
    expect(contactSchema.safeParse(input).success).toBe(false)
  })
})

describe('escapeHtml', () => {
  it('neutralises tags and quotes', () => {
    expect(escapeHtml('<script>"x"</script>')).toBe(
      '&lt;script&gt;&quot;x&quot;&lt;/script&gt;'
    )
  })
})

describe('sanitizeHeader', () => {
  it('strips newlines so headers cannot be injected', () => {
    expect(sanitizeHeader('Miguel\r\nBcc: victim@example.com')).toBe(
      'Miguel Bcc: victim@example.com'
    )
  })
})

describe('checkRateLimit', () => {
  beforeEach(() => resetRateLimits())

  it('allows up to the configured maximum', () => {
    for (let i = 0; i < RATE_LIMIT.max; i++) {
      expect(checkRateLimit('1.2.3.4').allowed).toBe(true)
    }
  })

  it('blocks the request after the maximum', () => {
    for (let i = 0; i < RATE_LIMIT.max; i++) checkRateLimit('1.2.3.4')
    const result = checkRateLimit('1.2.3.4')
    expect(result.allowed).toBe(false)
    expect(result.retryAfterSeconds).toBeGreaterThan(0)
  })

  it('tracks each caller independently', () => {
    for (let i = 0; i < RATE_LIMIT.max; i++) checkRateLimit('1.2.3.4')
    expect(checkRateLimit('5.6.7.8').allowed).toBe(true)
  })

  it('lets the caller back in once the window expires', () => {
    const now = Date.now()
    for (let i = 0; i < RATE_LIMIT.max; i++) checkRateLimit('1.2.3.4', now)
    expect(checkRateLimit('1.2.3.4', now).allowed).toBe(false)
    expect(checkRateLimit('1.2.3.4', now + RATE_LIMIT.windowMs + 1).allowed).toBe(true)
  })
})
