/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Explicitly specify the output directory for the build process
  // Supports customization via OUTPUT_DIRECTORY environment variable
  // This ensures the build output is routed correctly for Vercel deployment
  distDir: process.env.OUTPUT_DIRECTORY || '.next',
  // Ensure proper trailing slash behavior for Vercel routing
  trailingSlash: false,
}

module.exports = nextConfig
