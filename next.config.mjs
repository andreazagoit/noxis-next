import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enables Next.js Image Optimization with AVIF (+WebP fallback) for smaller images.
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Generate source maps for production so DevTools can map minified JS.
  productionBrowserSourceMaps: true,
  // Compress responses (default true in prod, here explicit).
  compress: true,
  // Strip `console.*` calls (except warn/error) from production bundles.
  compiler: {
    removeConsole: { exclude: ['warn', 'error'] },
  },
  // Long-cache static assets at the edge.
  async headers() {
    return [
      {
        source: '/(.*)\\.(jpg|jpeg|png|webp|avif|svg|ico|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
