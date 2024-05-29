/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.anthropic.com/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
