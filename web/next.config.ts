import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Change this to matches your repository name
  basePath: '/-Cac-Thanh-Doi-Dien-Buon-Chan',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
