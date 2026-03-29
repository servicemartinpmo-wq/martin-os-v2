/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only expose API routes; ignore app pages entirely.
  pageExtensions: ['route.js', 'route.ts', 'route.jsx', 'route.tsx'],
}

export default nextConfig

