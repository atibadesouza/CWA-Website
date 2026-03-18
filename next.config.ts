import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cookingwithatiba.com",
      },
    ],
  },
};

export default nextConfig;
