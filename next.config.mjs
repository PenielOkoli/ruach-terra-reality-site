/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  // WebP avoids stalled AVIF requests observed for two restored photos at 640px.
  images: { formats: ['image/webp'] },
};

export default nextConfig;
