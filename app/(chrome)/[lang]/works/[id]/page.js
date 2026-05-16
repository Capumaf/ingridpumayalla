"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

import { projectDetails } from "@/data/projectDetails";
import WorkCover from "@/components/WorkCover";

export default function WorkPage() {
  const { id } = useParams();
  const pathname = usePathname();

  const lang = pathname.startsWith("/es") ? "es" : "en";
  const project = projectDetails[id];

  if (!project) {
    return (
      <div className="px-6 pt-20">
        <p className="text-sm text-neutral-500">Project not found</p>
      </div>
    );
  }

  const cover = project.imageData?.[0];

  const title =
    typeof project.title === "string"
      ? project.title
      : project.title?.[lang];

  const text =
    typeof project.text === "string"
      ? project.text
      : project.text?.[lang] || project.text?.es || "";

  return (
    <div className="w-full flex justify-center px-6 pt-10 pb-24 overflow-hidden">
      <div className="w-full max-w-5xl md:pl-[120px] lg:pl-[160px]">

        {/* Botón de regreso */}
        <div className="mb-6">
          <Link
            href={`/${lang}/works`}
            className="text-xs tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            ← {lang === "es" ? "Volver a trabajos" : "Back to works"}
          </Link>
        </div>

        <WorkCover id={id} lang={lang} cover={cover} title={title} />

        <div className="max-w-[520px] mx-auto mt-8 md:mt-32 px-2">
          <h1 className="text-[28px] leading-tight tracking-[0.04em] mb-12 md:mb-24 text-center">
            {title}
          </h1>

          {text && (
            <div

  className="
  body-text
  max-w-[520px]
  text-[13.5px]
  leading-[2]
"
  dangerouslySetInnerHTML={{ __html: text }}
/>
        
          )}
        </div>
      </div>
    </div>
  );
}