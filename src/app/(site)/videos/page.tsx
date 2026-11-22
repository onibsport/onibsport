import type { Metadata } from "next";
import { YoutubeLogo } from "@phosphor-icons/react/dist/ssr";
import { getPublishedVideos } from "@/lib/data/db-videos";
import { YOUTUBE_CHANNEL_URL } from "@/lib/config";
import VideoGallery from "@/components/VideoGallery";
import AdSlot from "@/components/AdSlot";
import ProgrammePageHeader from "@/components/ProgrammePageHeader";

export const revalidate = 300;

const description = "Football highlights, reaction and analysis from the Onibsport team: the Premier League, Europe, the NPFL and the Super Eagles.";

export const metadata: Metadata = {
  title: "Videos",
  description,
  alternates: { canonical: "/videos" },
  openGraph: { title: "Videos | Onibsport", description, type: "website", url: "/videos" },
};

export default async function VideosPage() {
  const videos = await getPublishedVideos();

  return (
    <>
      <ProgrammePageHeader
        kicker="Onibsport TV"
        title="Watch"
        ghost="Play"
        meta="Highlights / reaction / analysis"
        intro={description}
        aside={
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border-2 border-white bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0_var(--color-orange)] transition-colors hover:border-orange hover:bg-orange"
          >
            <YoutubeLogo size={18} weight="fill" className="text-[#ff0033]" aria-hidden="true" />
            Subscribe on YouTube
          </a>
        }
      />
      <div className="programme-paper">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
        <VideoGallery videos={videos} />
        <AdSlot placement="videos" className="mt-14" />
      </div>
      </div>
    </>
  );
}
