import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { r2Configured, uploadToR2 } from "@/lib/r2";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

/**
 * Vercel Blob can authenticate two ways: the older BLOB_READ_WRITE_TOKEN, or
 * a connected store (BLOB_STORE_ID) plus the OIDC token Vercel provides to
 * every deployment. Stores connected recently only get the second kind.
 */
function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

export async function POST(request: NextRequest) {
  // Cloudflare R2 when it's set up; Vercel Blob otherwise.
  if (!r2Configured() && !blobConfigured()) {
    return NextResponse.json(
      {
        error:
          "Image uploads aren't connected here. Add the Cloudflare R2 settings (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, NEXT_PUBLIC_R2_PUBLIC_URL) in Vercel, then redeploy. Until then, paste an image URL instead.",
      },
      { status: 501 }
    );
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type. Use JPG, PNG, WEBP, GIF or AVIF." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is too large (8MB max)." }, { status: 400 });
  }

  try {
    if (r2Configured()) {
      return NextResponse.json({ url: await uploadToR2(file, "articles") });
    }
    const blob = await put(`articles/${Date.now()}-${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `The upload didn't go through: ${detail}. Try again, or paste an image URL instead.` },
      { status: 502 }
    );
  }
}
