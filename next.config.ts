import type { NextConfig } from "next";
import "@/lib/env";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    typedEnv: true,
  },
};

export default nextConfig;
