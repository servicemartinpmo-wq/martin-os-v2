/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/miiddle', destination: '/miidle', permanent: true },
      { source: '/miiddle/:path*', destination: '/miidle/:path*', permanent: true },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.pexels.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
