/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'pbs.twimg.com',  // Twitter プロフィール画像のドメイン
      'abs.twimg.com'   // Twitter 画像の代替ドメイン
    ],
  },
  reactStrictMode: true,
}

module.exports = nextConfig