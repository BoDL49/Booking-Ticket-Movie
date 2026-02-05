import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cinestar.com.vn",
      },
      {
        protocol: "https",
        hostname: "api-website.cinestar.com.vn",
      },
    ],
  },

};

export default nextConfig;
