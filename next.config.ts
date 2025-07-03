import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gbpncqznjyzgfqdcvifj.supabase.co",
      },
    ],
  },
};

export default nextConfig;
