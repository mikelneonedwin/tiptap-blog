import type { NextConfig } from "next";
import "@/lib/env";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    typedEnv: true,
    authInterrupts: true,
  },
};

export default nextConfig;
