/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
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