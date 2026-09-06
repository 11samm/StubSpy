import type { NextConfig } from "next";
const preview = process.env.STUBSPY_STATIC_PREVIEW === "1";
const nextConfig: NextConfig = {
  // The private design preview has no backend. Normal builds retain API routes.
  ...(preview ? { output: "export", distDir: ".next-preview", pageExtensions: ["tsx"], images: { unoptimized: true } } : {}),
};
export default nextConfig;
