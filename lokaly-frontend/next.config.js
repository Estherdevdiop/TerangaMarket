/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    domains: ['localhost', '127.0.0.1', 'via.placeholder.com', 'picsum.photos'],
  },
}
module.exports = nextConfig