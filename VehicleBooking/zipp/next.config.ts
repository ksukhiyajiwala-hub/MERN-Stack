import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: __dirname,
  },
};
module.exports = {
  allowedDevOrigins: [
    "192.168.29.180",
    "myapp.local",
    "movable-tilt-thirsty.ngrok-free.dev",
  ],
};
export default nextConfig;
