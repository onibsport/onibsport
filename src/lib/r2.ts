import { AwsClient } from "aws4fetch";

/**
 * Photo storage on Cloudflare R2 (S3-compatible, no charge for downloads).
 * Replaces Vercel Blob for uploads, whose Hobby allowance ran out and blocked
 * the store in November 2026. Needs five environment variables:
 *
 *   R2_ACCOUNT_ID          Cloudflare account ID
 *   R2_ACCESS_KEY_ID       R2 API token: Access Key ID
 *   R2_SECRET_ACCESS_KEY   R2 API token: Secret Access Key
 *   R2_BUCKET              bucket name, e.g. onibsport-photos
 *   NEXT_PUBLIC_R2_PUBLIC_URL  the bucket's public address, e.g. https://pub-xxxx.r2.dev
 *
 * Without them, r2Configured() is false and uploads fall back to Vercel Blob.
 */

export function r2Configured() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.NEXT_PUBLIC_R2_PUBLIC_URL
  );
}

/** A safe object name: lowercase letters, numbers and hyphens, keeping the extension. */
function objectKey(folder: string, fileName: string) {
  const dot = fileName.lastIndexOf(".");
  const ext = dot > 0 ? fileName.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  const base = (dot > 0 ? fileName.slice(0, dot) : fileName)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "photo";
  const random = crypto.randomUUID().slice(0, 8);
  return `${folder}/${Date.now()}-${base}-${random}${ext ? `.${ext}` : ""}`;
}

/** Uploads a file to R2 and returns its public address. Each upload gets its own name, so files never change. */
export async function uploadToR2(file: File, folder = "articles"): Promise<string> {
  const client = new AwsClient({
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    service: "s3",
    region: "auto",
  });
  const key = objectKey(folder, file.name);
  const endpoint = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET}/${key}`;
  const res = await client.fetch(endpoint, {
    method: "PUT",
    body: await file.arrayBuffer(),
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      // Safe to cache for a year: an upload's address never points at different content.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const code = text.match(/<Code>([^<]+)<\/Code>/)?.[1];
    throw new Error(`R2 refused the upload (${res.status}${code ? ` ${code}` : ""})`);
  }
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL!.replace(/\/+$/, "")}/${key}`;
}
