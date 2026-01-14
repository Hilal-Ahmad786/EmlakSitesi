/**
 * Simple in-memory rate limiter
 * For production, use Redis-based rate limiting
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitRecord>();

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
};

// Endpoint-specific configurations
const endpointConfigs: Record<string, RateLimitConfig> = {
  '/api/auth': { windowMs: 15 * 60 * 1000, maxRequests: 10 }, // 10 requests per 15 minutes
  '/api/contact': { windowMs: 60 * 1000, maxRequests: 5 }, // 5 per minute
  '/api/newsletter': { windowMs: 60 * 1000, maxRequests: 3 }, // 3 per minute
  '/api/admin': { windowMs: 60 * 1000, maxRequests: 200 }, // 200 per minute for admin
};

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  limit: number;
}

export function rateLimit(
  identifier: string,
  endpoint: string = 'default'
): RateLimitResult {
  const config = endpointConfigs[endpoint] || defaultConfig;
  const now = Date.now();
  const key = `${identifier}:${endpoint}`;

  // Clean up expired records periodically
  if (Math.random() < 0.01) {
    cleanupExpiredRecords();
  }

  const record = store.get(key);

  // No existing record, create new one
  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    store.set(key, newRecord);

    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: newRecord.resetTime,
      limit: config.maxRequests,
    };
  }

  // Increment count
  record.count++;
  store.set(key, record);

  const remaining = Math.max(0, config.maxRequests - record.count);
  const success = record.count <= config.maxRequests;

  return {
    success,
    remaining,
    resetTime: record.resetTime,
    limit: config.maxRequests,
  };
}

function cleanupExpiredRecords() {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now > record.resetTime) {
      store.delete(key);
    }
  }
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from headers (for proxied requests)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to a hash of user agent + accept headers (not ideal)
  const userAgent = request.headers.get('user-agent') || '';
  const accept = request.headers.get('accept') || '';
  return `ua:${hashString(userAgent + accept)}`;
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
  };
}

/**
 * Create rate limit response
 */
export function createRateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...getRateLimitHeaders(result),
        'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
      },
    }
  );
}
