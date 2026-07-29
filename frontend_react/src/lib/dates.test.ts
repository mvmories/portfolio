import { describe, expect, it } from 'vitest'

import { byMostRecent, formatDuration, formatMonthYear, formatRange, monthsBetween } from './dates'

describe('formatMonthYear', () => {
  it('formats a full date', () => {
    expect(formatMonthYear('2021-10-01')).toBe('Oct 2021')
  })

  it('accepts a month-only value', () => {
    expect(formatMonthYear('2021-01')).toBe('Jan 2021')
  })

  it('does not shift across timezones', () => {
    // `new Date('2021-01-01')` is UTC midnight, which is December 31st in any
    // negative offset. Parsing the string directly avoids reporting Dec 2020.
    expect(formatMonthYear('2021-01-01')).toBe('Jan 2021')
    expect(formatMonthYear('2021-12-31')).toBe('Dec 2021')
  })

  it.each([undefined, null, '', 'not a date', '2021', '2021-13-01', '2021-00-01'])(
    'returns empty for %p rather than throwing',
    (input) => {
      expect(formatMonthYear(input as string)).toBe('')
    }
  )
})

describe('formatRange', () => {
  it('joins both ends', () => {
    expect(formatRange('2021-10-01', '2022-05-01')).toBe('Oct 2021 — May 2022')
  })

  it('shows Present for a current role and ignores any end date', () => {
    expect(formatRange('2023-08-01', '2024-01-01', true)).toBe('Aug 2023 — Present')
  })

  it('falls back to the start alone when the end is missing', () => {
    expect(formatRange('2023-08-01', undefined)).toBe('Aug 2023')
  })

  it('returns empty without a start', () => {
    expect(formatRange(undefined, '2022-05-01')).toBe('')
  })
})

describe('monthsBetween', () => {
  it('counts months worked, including the last one', () => {
    // Feb 2015 to Jan 2018 is three years on a CV, and that is what Miguel's
    // states. Measuring the gap between the dates would report 2y 11m.
    expect(monthsBetween('2015-02-01', '2018-01-01')).toBe(36)
  })

  it('handles ranges within a year', () => {
    expect(monthsBetween('2021-03-01', '2021-09-01')).toBe(7)
  })

  it('handles ranges crossing a year boundary', () => {
    expect(monthsBetween('2021-09-01', '2022-03-01')).toBe(7)
  })

  it('counts a single month as one', () => {
    expect(monthsBetween('2021-05-01', '2021-05-01')).toBe(1)
  })

  it('returns null when the end precedes the start', () => {
    expect(monthsBetween('2022-01-01', '2021-01-01')).toBeNull()
  })

  it('returns null for unparseable input', () => {
    expect(monthsBetween('nonsense', '2021-01-01')).toBeNull()
  })
})

describe('formatDuration', () => {
  // Every expectation here is the duration Miguel's CV states for that role.
  it.each([
    ['2015-02-01', '2018-01-01', '3 yrs'],
    ['2022-03-01', '2023-07-01', '1 yr 5 mos'],
    ['2021-09-01', '2022-03-01', '7 mos'],
    ['2021-03-01', '2021-09-01', '7 mos'],
    ['2021-05-01', '2021-05-01', '1 mo'],
  ])('%s to %s is %s', (start, end, expected) => {
    expect(formatDuration(start, end)).toBe(expected)
  })

  it('measures a current role against today', () => {
    expect(formatDuration('2023-07-01', undefined, true, new Date('2026-07-15'))).toBe('3 yrs 1 mo')
  })

  it('ignores a stale end date on a current role', () => {
    expect(formatDuration('2023-07-01', '2023-09-01', true, new Date('2026-07-15'))).toBe(
      '3 yrs 1 mo'
    )
  })

  it('returns empty rather than throwing on bad input', () => {
    expect(formatDuration(undefined, undefined)).toBe('')
    expect(formatDuration('nope', 'also nope')).toBe('')
  })
})

describe('byMostRecent', () => {
  it('puts the newest first', () => {
    const sorted = [
      { startDate: '2015-01-01' },
      { startDate: '2023-08-01' },
      { startDate: '2021-10-01' },
    ].sort(byMostRecent)
    expect(sorted.map((r) => r.startDate)).toEqual(['2023-08-01', '2021-10-01', '2015-01-01'])
  })

  it('orders by month, not just year', () => {
    const sorted = [{ startDate: '2021-10-01' }, { startDate: '2021-01-01' }].sort(byMostRecent)
    expect(sorted[0].startDate).toBe('2021-10-01')
  })

  it('sorts undated entries last instead of dropping them', () => {
    const sorted = [{ startDate: undefined }, { startDate: '2021-01-01' }].sort(byMostRecent)
    expect(sorted[0].startDate).toBe('2021-01-01')
  })
})
