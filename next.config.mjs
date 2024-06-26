/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => [
        {
            source: "/anthropic/:path*",
            destination: "https://api.anthropic.com/:path*",
        },
    ],
};

export default nextConfig;
