/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Only use static export when building for deployment
  ...(process.env.STATIC_EXPORT === 'true' && {
    output: 'export',
    images: {
      unoptimized: true,
    },
    // GitHub Pages deployment configuration
    basePath: '/ai-safety-researcher-compiler',
    assetPrefix: '/ai-safety-researcher-compiler',
  }),
  async rewrites() {
    return [
      {
        source: '/roadmaps/:slug',
        destination: '/roadmap/:slug',
      },
    ]
  },
}

module.exports = nextConfig