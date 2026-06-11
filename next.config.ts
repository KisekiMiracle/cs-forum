import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.kiseki-miracle.dev",
        port: "",
        pathname: "/**", // Allows all files within your bucket paths
      },
    ],
  },
  allowedDevOrigins: ["csforum.kiseki-miracle.dev"],
};

export default nextConfig;
