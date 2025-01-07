/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/api/thumbnail/**',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
        pathname: '/api/thumbnail/**',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        pathname: '/**',
      }
    ],
  }
}

module.exports = nextConfig