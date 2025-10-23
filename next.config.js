/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir больше не нужен в экспериментальных опциях для Next.js 14
  // Полностью отключаем CSP для разработки
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
