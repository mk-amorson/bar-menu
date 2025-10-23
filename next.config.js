/** @type {import('next').NextConfig} */
const nextConfig = {
  // Обычная конфигурация для Vercel (не статичный экспорт)
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
