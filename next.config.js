/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/demo",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/partners",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/tour",
        destination: "/",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/client-portal/access",
        destination: "/portal-access",
      },
    ];
  },
};

export default config;
