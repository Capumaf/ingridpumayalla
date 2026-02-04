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

  const cover =
    project.images?.[0] || project.imageData?.[0] || null;

  const firstImageId = project.imageData?.[0]?.id ?? null;

  const title = pickLang(project.title, lang);
  const intro = pickLang(project.introduction, lang);

  const maxWidth = project.coverDisplay?.maxWidth ?? 720;
  const maxHeightVh = project.coverDisplay?.maxHeightVh ?? 72;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-screen-lg px-4 pt-6 pb-10 flex flex-col items-center gap-6">

        {/* top left controls */}
        <div className="w-full flex items-center gap-4">
          <button
            onClick={() => {
              const l = lang === "es" ? "en" : "es";
              setLang(l);
              router.push(`/works/${id}?lang=${l}`);
            }}
            className="text-xs tracking-widest text-gray-500 hover:text-black"
          >
            {lang === "es" ? "EN" : "ES"}
          </button>

          <button
            onClick={() => router.push(`/works?lang=${lang}`)}
            className="text-xl text-gray-400 hover:text-black"
            aria-label="Back to works"
          >
            ←
          </button>
        </div>

        {/* title */}
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          {title}
        </h1>

        {/* cover + arrows */}
        <div className="w-full flex justify-center">
          <div
            className="relative w-full flex justify-center"
            style={{ maxWidth: `${maxWidth}px` }}
          >
            {prevWorkId && (
              <button
                onClick={() =>
                  router.push(`/works/${prevWorkId}?lang=${lang}`)
                }
                className="absolute left-[-70px] top-1/2 -translate-y-1/2 text-6xl text-gray-600 hover:text-black"
              >
                ‹
              </button>
            )}

            {cover ? (
              firstImageId ? (
                <Link href={`/works/${id}/${firstImageId}?lang=${lang}`}>
                  <Image
                    src={cover.src}
                    alt={title}
                    width={cover.width ?? 1200}
                    height={cover.height ?? 800}
                    className="rounded-lg object-contain cursor-pointer"
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
                  className="rounded-lg object-contain"
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
                className="absolute right-[-70px] top-1/2 -translate-y-1/2 text-6xl text-gray-600 hover:text-black"
              >
                ›
              </button>
            )}
          </div>
        </div>

        {/* videos only for criaturas */}
        {id === "criaturas-del-bosque" &&
          project.videoClips?.length > 0 && (
            <div className="w-full max-w-4xl mt-2 p-4 bg-white rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                {project.videoClips.map((clip, i) => (
                  <VideoClip key={i} clip={clip} />
                ))}
              </div>
            </div>
          )}

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
