/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Resolver o problema com cloudflare:sockets
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'cloudflare:sockets': false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
