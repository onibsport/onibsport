/**
 * Photo addresses.
 *
 * Uploaded photos live in Vercel Blob, which has a monthly download allowance.
 * A plain <img src="…blob…"> downloads the full-size original for every single
 * visitor; in November 2026 that used the whole allowance and Vercel blocked the
 * store, so photos vanished. Always go through next/image (NewsImage) or, for
 * the few places that need a plain <img>, through optimizedSrc(): the image
 * optimizer downloads the original once, shrinks it and serves it from Vercel's
 * cache from then on.
 */

/** Shown in place of a photo that fails to load. */
export const FALLBACK_PHOTO = "/covers/default-cover.jpg";

/** Widths the image optimizer accepts (the default deviceSizes in next.config). */
type OptimizedWidth = 640 | 750 | 828 | 1080 | 1200 | 1920;

/** The R2 bucket's public host, e.g. pub-xxxx.r2.dev (from NEXT_PUBLIC_R2_PUBLIC_URL). */
const R2_HOST = (() => {
  try {
    return process.env.NEXT_PUBLIC_R2_PUBLIC_URL ? new URL(process.env.NEXT_PUBLIC_R2_PUBLIC_URL).hostname : "";
  } catch {
    return "";
  }
})();

/** True for photos we store ourselves: Vercel Blob (older uploads) or Cloudflare R2 (new uploads). */
export function isOwnPhotoHost(hostname: string): boolean {
  return hostname.endsWith(".public.blob.vercel-storage.com") || hostname.endsWith(".r2.dev") || (!!R2_HOST && hostname === R2_HOST);
}

/** True for images the optimizer is allowed to fetch: this site's own files and our stored uploads. */
export function isOptimizable(src: unknown): boolean {
  if (typeof src !== "string") return true;
  if (src.startsWith("/")) return !src.startsWith("/_next/image");
  try {
    return isOwnPhotoHost(new URL(src).hostname);
  } catch {
    return false;
  }
}

/** A shrunk, cached version of a photo for a plain <img>. Other hosts' images are returned unchanged. */
export function optimizedSrc(src: string, width: OptimizedWidth = 828): string {
  if (!src || !isOptimizable(src) || src.endsWith(".svg")) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

/** onError for a plain <img>: swap in the placeholder once. */
export function showFallbackPhoto(event: { currentTarget: HTMLImageElement }) {
  const img = event.currentTarget;
  if (img.dataset.fallback) return;
  img.dataset.fallback = "1";
  img.src = FALLBACK_PHOTO;
}
