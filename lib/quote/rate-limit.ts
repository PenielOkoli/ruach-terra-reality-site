import { createHash } from 'node:crypto';

// Per-process backstop, not a replacement for Vercel's distributed WAF rate limit.
// Keys are hashed and expired records are removed; memory cannot grow without bound.
export function createQuoteLimiter(perClient = 5, perMinute = 60) {
  const clients = new Map<string, { count: number; expires: number }>();
  let total = { count: 0, expires: 0 };
  return (client: string, now = Date.now()) => {
    if (total.expires <= now) total = { count: 0, expires: now + 60_000 };
    if (total.count >= perMinute) return Math.ceil((total.expires - now) / 1000);
    total.count++;
    for (const [key, record] of clients) if (record.expires <= now) clients.delete(key);
    const key = createHash('sha256').update(client).digest('hex');
    let record = clients.get(key);
    if (!record) {
      if (clients.size >= 5000) return 60;
      record = { count: 0, expires: now + 15 * 60_000 };
      clients.set(key, record);
    }
    if (record.count >= perClient) return Math.ceil((record.expires - now) / 1000);
    record.count++;
    return 0;
  };
}

export const quoteLimiter = createQuoteLimiter();
export const quoteIngressLimiter = createQuoteLimiter(30, 300);

export function quoteClientKey(request: Request) {
  // Vercel overwrites this header at its trusted edge. Do not trust arbitrary
  // X-Forwarded-For values on non-Vercel deployments.
  return process.env.VERCEL === '1'
    ? (request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() || 'unknown')
    : 'local-or-untrusted-proxy';
}
