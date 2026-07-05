/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Keeps your existing eslint block settings if any were hidden inside
    ignoreDuringBuilds: true, 
  },
  staticPageGenerationTimeout: 120, 
  images: {
    unoptimized: true, 
  },
};

module.exports = nextConfig;