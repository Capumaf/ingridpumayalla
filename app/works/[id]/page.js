"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { WORK_ORDER } from "../../data/worksOrder";
import { projectDetails } from "../../data/projectDetails";

function VideoClip({ clip }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      if (typeof clip.start === "number") video.currentTime = clip.start;
      video.playbackRate = 0.5;
      video.play().catch(() => {});
    };

    const loop = () => {
      if (
        typeof clip.start === "number" &&
        typeof clip.end === "number" &&
        video.currentTime >= clip.end
      ) {
        video.currentTime = clip.start;
        video.play().catch(() => {});
      }
    };

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("timeupdate", loop);

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("timeupdate", loop);
    };
  }, [clip]);

  return (
    <div className="flex-1 max-w-[640px]">
      <video
        ref={videoRef}
        muted
        playsInline
        controls={false}
        className="w-full rounded-xl shadow-lg"
      >
        <source src={clip.src} type="video/mp4" />
      </video>
    </div>
  );
}

const pickLang = (v, lang) => {
  if (!v) return "";
  if (typeof v === "string") return v;
  return v?.[lang] ?? v?.es ?? v?.en ?? "";
};

export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlLang = searchParams.get("lang");
  const [lang, setLang] = useState(urlLang === "en" ? "en" : "es");

  useEffect(() => {
    setLang(urlLang === "en" ? "en" : "es");
  }, [urlLang]);

  const project = projectDetails[id];
  if (!project) return null;

  const { prevWorkId, nextWorkId } = useMemo(() => {
    const i = WORK_ORDER.indexOf(id);
    return {
      prevWorkId: i > 0 ? WORK_ORDER[i - 1] : null,
      nextWorkId: i < WORK_ORDER.length - 1 ? WORK_ORDER[i + 1] : null,
    };
  }, [id]);

  const cover = project.images?.[0] || project.imageData?.[0] || null;
  const firstImageId = project.imageData?.[0]?.id ?? null;

  const title = pickLang(project.title, lang);
  const intro = pickLang(project.introduction, lang);

  const maxWidth = project.coverDisplay?.maxWidth ?? 720;
  const maxHeightVh = project.coverDisplay?.maxHeightVh ?? 72;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-screen-lg px-4 pt-6 pb-10 flex flex-col items-center gap-6">

        {/* title */}
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          {title}
        </h1>

        {/* cover */}
        <div className="w-full flex justify-center">
          <div
            className="relative w-full flex flex-col items-center"
            style={{ maxWidth: `${maxWidth}px` }}
          >
            {/* DESKTOP arrows (unchanged) */}
            {prevWorkId && (
              <button
                onClick={() =>
                  router.push(`/works/${prevWorkId}?lang=${lang}`)
                }
                className="hidden md:block absolute left-[-70px] top-1/2 -translate-y-1/2 text-6xl text-gray-600 hover:text-black"
                aria-label={lang === "es" ? "Anterior" : "Previous"}
              >
                ‹
              </button>
            )}

            {cover ? (
              firstImageId ? (
                <Link
                  href={`/works/${id}/${firstImageId}?lang=${lang}`}
                  className="w-full"
                >
                  <Image
                    src={cover.src}
                    alt={title}
                    width={cover.width ?? 1200}
                    height={cover.height ?? 800}
                    className="w-full rounded-lg object-contain"
                    style={{ maxHeight: `${maxHeightVh}vh` }}
                    priority
                  />
                </Link>
              ) : (
                <Image
                  src={cover.src}
                  alt={title}
                  width={cover.width ?? 1200}
                  height={cover.height ?? 800}
                  className="w-full rounded-lg object-contain"
                  style={{ maxHeight: `${maxHeightVh}vh` }}
                  priority
                />
              )
            ) : (
              <div className="h-10 w-full" />
            )}

            {nextWorkId && (
              <button
                onClick={() =>
                  router.push(`/works/${nextWorkId}?lang=${lang}`)
                }
                className="hidden md:block absolute right-[-70px] top-1/2 -translate-y-1/2 text-6xl text-gray-600 hover:text-black"
                aria-label={lang === "es" ? "Siguiente" : "Next"}
              >
                ›
              </button>
            )}

            {/* MOBILE arrows BELOW image */}
            <div className="flex md:hidden w-full justify-between px-12 mt-4">
              {prevWorkId ? (
                <button
                  onClick={() =>
                    router.push(`/works/${prevWorkId}?lang=${lang}`)
                  }
                  className="text-5xl font-light text-gray-600 hover:text-black transition-colors"
                  aria-label={lang === "es" ? "Anterior" : "Previous"}
                >
                  ‹
                </button>
              ) : (
                <span />
              )}

              {nextWorkId ? (
                <button
                  onClick={() =>
                    router.push(`/works/${nextWorkId}?lang=${lang}`)
                  }
                  className="text-5xl font-light text-gray-600 hover:text-black transition-colors"
                  aria-label={lang === "es" ? "Siguiente" : "Next"}
                >
                  ›
                </button>
              ) : (
                <span />
              )}
            </div>
          </div>
        </div>

        {/* introduction */}
        {intro && (
          <div className="w-full max-w-2xl mt-4 text-sm md:text-base text-justify space-y-4 px-4">
            {intro.split(/\n\s*\n/).map((p, i) => (
              <p key={i}>{p.trim()}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
