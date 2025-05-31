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
    // If deploying to github.io/repository-name, uncomment and update:
    // basePath: '/ai-safety-research-compiler',
    // assetPrefix: '/ai-safety-research-compiler',
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