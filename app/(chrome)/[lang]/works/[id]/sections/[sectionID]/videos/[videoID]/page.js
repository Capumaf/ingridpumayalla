"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { projectDetails } from "@/data/projectDetails";

export default function SectionVideoPage() {
  const { id, sectionID, videoID } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const [visible, setVisible] = useState(false);

  const lang = pathname.startsWith("/es") ? "es" : "en";
  const project = projectDetails[id];

  const section = project?.sections?.find((item) => item.id === sectionID);
  const video = section?.videoData?.find((item) => item.id === videoID);

  const videoIndex = section?.videoData?.findIndex((item) => item.id === videoID) ?? -1;
  const nextVideo = videoIndex > -1 ? section?.videoData?.[videoIndex + 1] : null;
  const nextVideoHref = nextVideo
    ? `/${lang}/works/${id}/sections/${sectionID}/videos/${nextVideo.id}`
    : null;

  const sectionHref = `/${lang}/works/${id}/sections/${sectionID}`;
  const firstImage = section?.mediaData?.[0];

  const imageHref = firstImage
    ? `/${lang}/works/${id}/sections/${sectionID}/${firstImage.id}`
    : sectionHref;

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(imageHref);
    }
  };

  const prevVideo = videoIndex > 0 ? section?.videoData?.[videoIndex - 1] : null;
  const prevVideoHref = prevVideo
    ? `/${lang}/works/${id}/sections/${sectionID}/videos/${prevVideo.id}`
    : imageHref;

  const sectionIndex = project?.sections?.findIndex(
    (item) => item.id === sectionID
  ) ?? -1;
  const nextSection =
    sectionIndex > -1 ? project?.sections?.[sectionIndex + 1] : null;
  const nextSectionHref = nextSection
    ? `/${lang}/works/${id}/sections/${nextSection.id}`
    : null;

  useEffect(() => {
    const footer = document.querySelector("footer");

    if (footer) footer.style.display = "none";
    document.body.style.overflow = "hidden";

    const t = requestAnimationFrame(() => setVisible(true));

    return () => {
      cancelAnimationFrame(t);
      if (footer) footer.style.display = "";
      document.body.style.overflow = "";
    };
  }, []);

  if (!project || !section || !video) {
    return <div>Video not found.</div>;
  }

  const sectionTitle =
    typeof section.title === "string"
      ? section.title
      : section.title?.[lang] || section.title?.es || "";

  const videoTitle =
    typeof video.title === "string"
      ? video.title
      : video.title?.[lang] || video.title?.es || sectionTitle;

  const videoDescription =
    typeof video.description === "string"
      ? video.description
      : video.description?.[lang] || video.description?.es || "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 600ms ease",
      }}
    >
      <div className="w-full h-full px-5 md:px-10 py-6 md:py-10 flex flex-col">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between mb-6">
          {prevVideo ? (
            <Link
              href={prevVideoHref}
              className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
            >
              ← {lang === "es" ? "Video anterior" : "Previous video"}
            </Link>
          ) : (
            <button
              type="button"
              onClick={goBack}
              className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
            >
              ← {lang === "es" ? "Atrás" : "Back"}
            </button>
          )}

          {video.duration && (
            <p className="text-xs tracking-widest text-neutral-400">
              {video.duration}
            </p>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center px-5">
  {video.driveUrl ? (
    <iframe
      src={video.driveUrl}
      title={videoTitle}
      allow="autoplay; fullscreen"
      allowFullScreen
      className="w-full max-w-full md:max-w-6xl max-h-[42vh] md:max-h-[78vh] object-cover aspect-video"
    />
  ) : video.vimeoUrl ? (
    <iframe
      src={video.vimeoUrl.replace("vimeo.com/", "player.vimeo.com/video/")}
      title={videoTitle}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      className="w-full max-w-full md:max-w-6xl max-h-[42vh] md:max-h-[78vh] object-cover aspect-video"
    />
  ) : (
    <video
      src={video.src}
      controls
      playsInline
      preload="metadata"
      poster={video.poster}
      className="w-full max-w-full md:max-w-6xl max-h-[42vh] md:max-h-[78vh] object-cover aspect-video"
    />
  )}
</div>

        <div className="mt-4 max-w-6xl mx-auto w-full flex items-start justify-between gap-6">
          <div>
            <p className="text-xs text-neutral-400 tracking-widest mb-2">
              {sectionTitle}
            </p>

            <h1 className="text-base md:text-lg font-normal tracking-[0.04em]">
              {videoTitle}
            </h1>

            {videoDescription && (
              <div
                className="mt-3 text-xs md:text-sm leading-relaxed text-neutral-600 max-w-xl"
                dangerouslySetInnerHTML={{
                  __html: videoDescription,
                }}
              />
            )}
          </div>

          <div className="flex flex-col items-end gap-3 shrink-0">
            {nextVideoHref && (
              <Link
                href={nextVideoHref}
                className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
              >
                {lang === "es" ? "Siguiente video" : "Next video"} →
              </Link>
            )}

            {!nextVideoHref && nextSectionHref ? (
              <Link
                href={nextSectionHref}
                className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
              >
                {lang === "es" ? "Siguiente sección" : "Next section"} →
              </Link>
            ) : (
              <Link
                href={`/${lang}/works`}
                className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
              >
                {lang === "es" ? "Volver a obras" : "Back to works"} →
              </Link>
            )}

            {(video.fullVideoUrl || video.vimeoUrl) && (
              <a
                href={video.fullVideoUrl || video.vimeoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
              >
                {lang === "es" ? "Ver video completo ↗" : "Watch full video ↗"}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}