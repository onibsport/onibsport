import type { NextConfig } from "next";

/** A custom domain for the R2 photo bucket, if one is set. */
const r2Host = (() => {
  try {
    return process.env.NEXT_PUBLIC_R2_PUBLIC_URL ? new URL(process.env.NEXT_PUBLIC_R2_PUBLIC_URL).hostname : "";
  } catch {
    return "";
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // New uploads: Cloudflare R2 (its r2.dev address, or a custom domain set in NEXT_PUBLIC_R2_PUBLIC_URL).
      { protocol: "https", hostname: "*.r2.dev" },
      ...(r2Host ? [{ protocol: "https" as const, hostname: r2Host }] : []),
    ],
    // Keep each shrunk photo in Vercel's cache for a month instead of four hours. Uploaded photos
    // never change (every upload gets its own address), and each refresh re-downloads the original
    // from Vercel Blob, which counts against the store's monthly download allowance.
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
};

export default nextConfig;
