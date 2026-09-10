"use client";

import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { projectDetails } from "@/data/projectDetails";

const buildVimeoSrc = (vimeoUrl) => {
  const base = vimeoUrl.replace("vimeo.com/", "player.vimeo.com/video/");
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}color=b7623b&title=0&byline=0&portrait=0&dnt=1`;
};

export default function WorkVideoPage() {
  const { id, videoID } = useParams();
  const pathname = usePathname();

  const [visible, setVisible] = useState(false);

  const lang = pathname.startsWith("/es") ? "es" : "en";
  const project = projectDetails[id];

  const video = project?.videoData?.find((item) => item.id === videoID);

  const videoIndex = project?.videoData?.findIndex((item) => item.id === videoID) ?? -1;
  const nextVideo = videoIndex > -1 ? project?.videoData?.[videoIndex + 1] : null;
  const nextVideoHref = nextVideo ? `/${lang}/works/${id}/videos/${nextVideo.id}` : null;

  const firstPoem = project?.poems?.[0] || null;
  const nextPoemHref =
    !nextVideo && firstPoem
      ? `/${lang}/works/${id}/poems/${firstPoem.id}`
      : null;

  const workHref = `/${lang}/works/${id}`;
  const firstImage = project?.imageData?.[0] || project?.mediaData?.[0];

  const imageHref = firstImage
    ? `/${lang}/works/${id}/${firstImage.id}`
    : workHref;

  const prevVideo = videoIndex > 0 ? project?.videoData?.[videoIndex - 1] : null;
  const prevVideoHref = prevVideo
    ? `/${lang}/works/${id}/videos/${prevVideo.id}`
    : imageHref;

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

  if (!project || !video) {
    return <div>Video not found.</div>;
  }

  const workTitle =
    typeof project.title === "string"
      ? project.title
      : project.title?.[lang] || project.title?.es || "";

  const videoTitle =
    typeof video.title === "string"
      ? video.title
      : video.title?.[lang] || video.title?.es || workTitle;

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
          <Link
            href={prevVideo ? prevVideoHref : imageHref}
            className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
          >
            ← {prevVideo
              ? lang === "es"
                ? "Video anterior"
                : "Previous video"
              : lang === "es"
                ? "Volver a imagen"
                : "Back to image"}
          </Link>

          {video.duration && (
            <p className="text-xs tracking-widest text-neutral-400">
              {video.duration}
            </p>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center px-5">
          <div className="w-full max-w-[820px] mx-auto rounded-xl md:rounded-2xl overflow-hidden bg-black shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
            {video.vimeoUrl ? (
              <iframe
                src={buildVimeoSrc(video.vimeoUrl)}
                title={videoTitle}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-full aspect-video block"
              />
            ) : (
              <video
                src={video.src}
                controls
                playsInline
                preload="metadata"
                poster={video.poster}
                className="w-full aspect-video block"
              />
            )}
          </div>
        </div>

        <div className="mt-4 max-w-6xl mx-auto w-full flex items-start justify-between gap-6">
          <div>
            <p className="text-xs text-neutral-400 tracking-widest mb-2">
              {workTitle}
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
            {nextVideoHref ? (
              <Link
                href={nextVideoHref}
                className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
              >
                {lang === "es" ? "Siguiente video" : "Next video"} →
              </Link>
            ) : nextPoemHref ? (
              <Link
                href={nextPoemHref}
                className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
              >
                {lang === "es" ? "Leer poema" : "Read poem"} →
              </Link>
            ) : null}

            <Link
              href={`/${lang}/works`}
              className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
            >
              {lang === "es" ? "Volver a obras" : "Back to works"} →
            </Link>

            {video.fullVideoUrl && (
              <a
                href={video.fullVideoUrl}
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