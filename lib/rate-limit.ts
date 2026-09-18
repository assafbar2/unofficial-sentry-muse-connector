type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const LIMIT = 60;
const WINDOW_MS = 60_000;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
};

export function rateLimit(key: string, now = Date.now()): RateLimitResult {
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    const next: Bucket = { count: 1, resetAt: now + WINDOW_MS };
    buckets.set(key, next);
    return {
      allowed: true,
      remaining: LIMIT - 1,
      resetAt: next.resetAt,
      limit: LIMIT,
    };
  }

  existing.count += 1;
  const allowed = existing.count <= LIMIT;
  return {
    allowed,
    remaining: Math.max(0, LIMIT - existing.count),
    resetAt: existing.resetAt,
    limit: LIMIT,
  };
}

export function rateLimitKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export function resetRateLimitForTests() {
  buckets.clear();
}
