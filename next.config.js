/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Explicitly specify the output directory for the build process
  distDir: '.next',
  // Configure output for optimal Vercel deployment
  output: 'standalone',
  // Ensure proper routing for Vercel
  trailingSlash: false,
}

module.exports = nextConfig
