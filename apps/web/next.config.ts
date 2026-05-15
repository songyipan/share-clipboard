import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile packages from monorepo
  transpilePackages: ["@share-clipboard/ui"],
};

export default nextConfig;
