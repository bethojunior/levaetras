import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  outputFileTracingExcludes: {
    "/*": [
      "./data/**/*",
      "./backups/**/*",
      "./.admin-credentials",
      "./.env*",
      "./test-results/**/*",
    ],
  },
};
export default nextConfig;
