
/**
 * Fixed-window rate limiter backed by module scope.
 *
 * Serverless instances are ephemeral and not shared, so this is best-effort:
 * it stops casual abuse and accidental double-submits, not a determined
 * attacker. Swap in Upstash Redis if that ever becomes necessary.
 */

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

export const RATE_LIMIT = {
  max: Number(process.env.CONTACT_RATE_LIMIT_MAX ?? 3),
  windowMs: Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS ?? 10 * 60 * 1000),
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

export function checkRateLimit(key: string, now = Date.now()): RateLimitResult {
  // Opportunistic cleanup so the map cannot grow without bound.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k)
  }

  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT.windowMs })
    return { allowed: true, remaining: RATE_LIMIT.max - 1, retryAfterSeconds: 0 }
  }

  existing.count += 1

  if (existing.count > RATE_LIMIT.max) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    }
  }

  return {
    allowed: true,
    remaining: RATE_LIMIT.max - existing.count,
    retryAfterSeconds: 0,
  }
}

/** Only used by tests. */
export function resetRateLimits(): void {
  buckets.clear()
}
