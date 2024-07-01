/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  // distDir: 'dist',
  rewrites: async () => [
    {
      source: "/anthropic/:path*",
      destination: "https://api.anthropic.com/:path*",
    },
  ],
};

export default nextConfig;
