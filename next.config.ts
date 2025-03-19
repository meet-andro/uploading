import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  experimental: {
    serverActions: {
      bodySizeLimit: "20MB",
    },
  },

  env: {
    CHUNK_SIZE: (10 * 1024 * 1024).toString(),
  },
};

export default nextConfig;
