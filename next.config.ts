import type { NextConfig } from "next"
import { S3_BASE_DOMAIN, S3_BASE_URL_TEMP_DOMAIN } from "@/CONSTANTS"

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: S3_BASE_DOMAIN,
      },
      {
        protocol: "https",
        hostname: S3_BASE_URL_TEMP_DOMAIN,
      },
    ],
  },
}

export default nextConfig
