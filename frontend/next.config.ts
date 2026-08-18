import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/",
      destination: "/workspace",
      permanent: false,
    },
  ],
};

export default nextConfig;
