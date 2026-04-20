"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import { WORK_ORDER } from "../../../data/worksOrder";
import { projectDetails } from "../../../data/projectDetails";

const pickLang = (value, lang) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] ?? value.es ?? value.en ?? "";
};

export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const lang = searchParams.get("lang") || "en";
  const project = projectDetails[id];

  if (!project) {
    return <div className="mt-20 text-center">Proyecto no encontrado</div>;
  }

  if (!project.imageData) {
    return <div className="mt-20 text-center">Sin imágenes</div>;
  }

  const cover = project.imageData?.[0] ?? null;
  const firstImageId = cover?.id ?? null;

  const { prevWorkId, nextWorkId } = useMemo(() => {
    const index = WORK_ORDER.indexOf(id);
    return {
      prevWorkId: index > 0 ? WORK_ORDER[index - 1] : null,
      nextWorkId: index < WORK_ORDER.length - 1 ? WORK_ORDER[index + 1] : null,
    };
  }, [id]);

  const title = pickLang(project.title, lang);
  const intro = pickLang(project.introduction, lang);

  const maxWidth = project.coverDisplay?.maxWidth ?? 720;
  const maxHeightVh = project.coverDisplay?.maxHeightVh ?? 72;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-screen-lg px-4 pt-6 pb-10 flex flex-col items-center gap-6">

        {/* BACK */}
        <Link
          href={`/works?lang=${lang}`}
          className="self-start text-sm text-gray-500 hover:text-black"
        >
          ← {lang === "es" ? "Obras" : "Works"}
        </Link>

        {/* TITLE */}
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          {title}
        </h1>

        {/* COVER */}
        <div className="w-full flex justify-center">
          <div
            className="relative w-full flex flex-col items-center"
            style={{ maxWidth: `${maxWidth}px` }}
          >
            {prevWorkId && (
              <button
                onClick={() => router.push(`/works/${prevWorkId}?lang=${lang}`)}
                className="hidden md:block absolute left-[-70px] top-1/2 -translate-y-1/2 text-6xl text-gray-600 hover:text-black"
              >
                ‹
              </button>
            )}

            {cover && (
              firstImageId ? (
                <Link href={`/works/${id}/${firstImageId}?lang=${lang}`}>
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
            )}

            {nextWorkId && (
              <button
                onClick={() => router.push(`/works/${nextWorkId}?lang=${lang}`)}
                className="hidden md:block absolute right-[-70px] top-1/2 -translate-y-1/2 text-6xl text-gray-600 hover:text-black"
              >
                ›
              </button>
            )}
          </div>
        </div>

        {/* INTRO */}
        {intro && (
          <div className="w-full max-w-2xl mt-4 text-sm text-justify space-y-4 px-4">
            {intro.split(/\n\s*\n/).map((p, i) => (
              <p key={i}>{p.trim()}</p>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}