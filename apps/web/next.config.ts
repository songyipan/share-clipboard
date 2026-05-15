import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack workspace root - set via environment variable or relative path
  experimental: {
    // Use webpack instead of turbopack for monorepo compatibility
  },
};

export default nextConfig;
