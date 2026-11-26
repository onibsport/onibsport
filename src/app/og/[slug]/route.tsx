import { NextRequest } from "next/server";
import { getArticleBySlug } from "@/lib/data/db-articles";
import { renderShareCard } from "@/lib/shareCard";
import { shareTextFor } from "@/lib/shareImage";
import { parseFocus } from "@/lib/focus";

/**
 * A story's branded link-preview image (1200 × 630): the lead photo with the
 * social headline (not the article title) in the Onibsport template. Story
 * pages point their og:image here unless the editor uploaded their own share
 * image (see lib/shareImage.ts). Cached at the edge; the ?v= fingerprint
 * changes when the headline, photo or focal point does.
 *
 * Sent as a compressed JPEG (about 150 KB): the PNG the renderer draws is over
 * 1 MB, and WhatsApp skips share images over about 600 KB while X and Facebook
 * give up on slow ones, so links showed no picture. Falls back to the PNG.
 */
const CACHE = "public, max-age=3600, s-maxage=604800, stale-while-revalidate=86400";

async function asJpeg(card: Response): Promise<Response> {
  if (!card.ok) return card;
  const png = Buffer.from(await card.arrayBuffer());
  try {
    const sharp = (await import("sharp")).default;
    const jpeg = await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": "image/jpeg", "Cache-Control": CACHE } });
  } catch {
    return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png", "Cache-Control": CACHE } });
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return asJpeg(await renderShareCard({ origin: request.nextUrl.origin, text: "Football news with an African lens", shape: "landscape" }));
  }
  return asJpeg(
    await renderShareCard({
      origin: request.nextUrl.origin,
      image: article.image,
      text: shareTextFor(article),
      focus: parseFocus(article.imageFocus),
      shape: "landscape",
    })
  );
}
