import type { NextConfig } from "next";

const legacySiteUrl = "https://cathedral-life-center.webflow.io";
const legacyFallbackRoutes = [
  "/about",
  "/adoption",
  "/classes",
  "/coaching",
  "/contact",
  "/donate",
  "/foster-care",
  "/fresh-start",
  "/grace-garage",
  "/groups",
  "/residency-programs",
  "/volunteer",
] as const;

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    qualities: [75, 85],
  },
  async redirects() {
    return [
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      ...legacyFallbackRoutes.map((route) => ({
        source: route,
        destination: `${legacySiteUrl}${route}`,
        permanent: false,
      })),
    ];
  },
};

export default nextConfig;
