/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // Specify Node.js runtime for API routes
  runtime: 'nodejs',
};

export default nextConfig; 