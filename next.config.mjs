/** @type {import('next').NextConfig} */
const nextConfig = {
  // The nested `martin-os/` directory is a separate scaffold and should not
  // be type-checked as part of this app's production build.
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },
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
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/api/**',
      },
    ],
  },
}

export default nextConfig
