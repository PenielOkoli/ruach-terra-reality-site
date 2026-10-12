import { createRequire } from 'node:module';
const { headers: securityHeaders } = createRequire(import.meta.url)('./vercel.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  // Apply the same policy on Next.js hosts as on Vercel. Next's static hydration
  // needs inline scripts; event handlers and arbitrary external sources are blocked.
  async headers() {
    const dev = process.env.NODE_ENV !== 'production';
    return securityHeaders.map(rule => ({ ...rule, headers: rule.headers
      .filter(header => !dev || header.key !== 'Strict-Transport-Security')
      .map(header => header.key === 'Content-Security-Policy' && dev
        ? { ...header, value: header.value.replace("script-src 'self' 'unsafe-inline'", "script-src 'self' 'unsafe-inline' 'unsafe-eval'").replace("connect-src 'self'", "connect-src 'self' ws: wss:").replace('; upgrade-insecure-requests', '') }
        : header) }));
  },
  // WebP avoids stalled AVIF requests observed for two restored photos at 640px.
  images: { formats: ['image/webp'] },
};

export default nextConfig;
