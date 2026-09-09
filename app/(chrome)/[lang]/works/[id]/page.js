"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Head from "next/head";

import { projectDetails } from "@/data/projectDetails";
import WorkCover from "@/components/WorkCover";

export default function WorkPage() {
  const { id } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const lang = pathname.startsWith("/es") ? "es" : "en";
  const project = projectDetails[id];

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(`/${lang}/works`);
    }
  };

  if (!project) {
    return (
      <div className="px-6 pt-20">
        <p className="text-sm text-neutral-500">Project not found</p>
      </div>
    );
  }

  const cover = project.imageData?.[0];

  const firstSection = project.sections?.[0] || null;
  const seriesHref = firstSection
    ? `/${lang}/works/${id}/sections/${firstSection.id}`
    : null;

  const title =
    typeof project.title === "string"
      ? project.title
      : project.title?.[lang] || project.title?.es || "";

  const epigraph =
    typeof project.epigraph === "string"
      ? project.epigraph
      : project.epigraph?.[lang] || project.epigraph?.es || "";

  const text =
    typeof project.text === "string"
      ? project.text
      : project.text?.[lang] || project.text?.es || "";

  const coverSrc = cover?.src || null;

  return (
    <>
      {coverSrc && (
        <Head>
          <link rel="preload" as="image" href={coverSrc} />
        </Head>
      )}

      <div className="w-full flex justify-center px-6 pt-10 pb-24 overflow-hidden">
        <div className="w-full max-w-5xl md:pl-[100px] lg:pl-[120px]">

          {/* BACK BUTTON */}
          <div className="mb-6">
            <button
              type="button"
              onClick={goBack}
              className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b] transition-colors"
            >
              ← {lang === "es" ? "Atrás" : "Back"}
            </button>
          </div>

          {/* WORK COVER */}
          <WorkCover
            id={id}
            lang={lang}
            cover={cover}
            title={title}
            seriesHref={seriesHref}
          />

          {/* WORK CONTENT */}
          <div className="max-w-[620px] mx-auto mt-16 md:mt-28 px-2">

            {/* TITLE */}
            <h1 className="text-[28px] leading-tight tracking-[0.04em] mb-6 md:mb-10 text-center">
              {title}
            </h1>

            {/* EPIGRAPH / POEM */}
            {epigraph && (
              <div
                className="
                  body-text
                  max-w-[420px]
                  mb-12
                  text-[13.5px]
                  leading-[2]
                  text-left
                  md:ml-16
                  lg:ml-24
                "
                dangerouslySetInnerHTML={{
                  __html: epigraph,
                }}
              />
            )}

            {/* MAIN TEXT */}
            {text && (
              <div
                className="body-text max-w-[620px] text-[13.5px] leading-[2] text-justify"
                dangerouslySetInnerHTML={{
                  __html: text,
                }}
              />
            )}

          </div>
        </div>
      </div>
    </>
  );
}