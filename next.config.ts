import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "pub-b4a48ea5422f416b901c94e869fc9159.r2.dev" },
      { protocol: "http", hostname: "68.178.164.48" },
      { protocol: "http", hostname: "10.10.26.159" },
    ],
  },
};

export default nextConfig;
