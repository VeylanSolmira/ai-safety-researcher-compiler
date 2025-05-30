/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
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