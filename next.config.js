/** @type {import('next').NextConfig} */
const nextConfig = {
  // Настройка для статичного экспорта
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
}

module.exports = nextConfig
