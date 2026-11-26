/**
 * In-memory sliding-window rate limiter for serverless Next.js edge/node routes.
 * Tracks requests per IP within a specified time window.
 */

interface RateLimitRecord {
  count: number
  expiresAt: number
}

const rateLimitStore = new Map<string, RateLimitRecord>()

// Periodic cleanup of expired records (runs every 5 minutes if invoked)
let lastCleanup = Date.now()
function cleanupExpired() {
  const now = Date.now()
  if (now - lastCleanup < 300000) return
  lastCleanup = now
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.expiresAt < now) {
      rateLimitStore.delete(key)
    }
  }
}

export interface RateLimitOptions {
  limit?: number
  windowMs?: number
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { success: boolean; remaining: number; reset: number } {
  cleanupExpired()

  const limit = options.limit ?? 5
  const windowMs = options.windowMs ?? 60000 // 1 minute default
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || record.expiresAt < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      expiresAt: now + windowMs,
    })
    return {
      success: true,
      remaining: limit - 1,
      reset: Math.ceil((now + windowMs) / 1000),
    }
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      reset: Math.ceil(record.expiresAt / 1000),
    }
  }

  record.count += 1
  return {
    success: true,
    remaining: limit - record.count,
    reset: Math.ceil(record.expiresAt / 1000),
  }
}
