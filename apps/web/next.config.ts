/** @spec docs/specs/P0.C-1-nextjs-bootstrap.md */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@aiclassroom/ui"],
  turbopack: {
    root: "../..",
  },
};

export default nextConfig;
