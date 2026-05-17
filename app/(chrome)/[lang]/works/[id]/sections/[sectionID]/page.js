"use client";

import SectionCover from "@/components/SectionCover";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

import { projectDetails } from "@/data/projectDetails";

export default function WorkSectionPage() {
  const { id, sectionID } = useParams();

  const pathname = usePathname();

  const lang = pathname.startsWith("/es")
    ? "es"
    : "en";

  const project = projectDetails[id];

  const section =
    project?.sections?.find(
      (item) => item.id === sectionID
    );

  if (!project || !section) {
    return (
      <div className="px-6 pt-20">
        <p className="text-sm text-neutral-500">
          Section not found
        </p>
      </div>
    );
  }

  const text =
    typeof section.text === "string"
      ? section.text
      : section.text?.[lang] ||
        section.text?.es ||
        "";

  const firstMedia =
    section.mediaData?.[0];

  const mediaHref = firstMedia
    ? `/${lang}/works/${id}/sections/${sectionID}/${firstMedia.id}`
    : null;

  return (
    <div className="w-full flex justify-center px-6 pt-10 pb-24 overflow-hidden">
      <div className="w-full max-w-5xl md:pl-[120px] lg:pl-[160px]">
        {/* BACK */}
        <div className="mb-6">
          <Link
            href={`/${lang}/works/${id}`}
            className="text-xs tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            ←{" "}
            {lang === "es"
              ? "Volver al proyecto"
              : "Back to project"}
          </Link>
        </div>

        {/* COVER */}
        {section.cover && mediaHref && (
          <SectionCover
            href={mediaHref}
            cover={section.cover}
            title={section.title}
          />
        )}

        {/* TEXT */}
        <div className="max-w-[520px] mx-auto mt-8 md:mt-32 px-2">
          <h1 className="text-[28px] leading-tight tracking-[0.04em] mb-12 md:mb-24 text-center">
            {section.title}
          </h1>

          {text && (
            <div
              className="
                body-text
                max-w-[520px]
                text-[13.5px]
                leading-[2]
              "
              dangerouslySetInnerHTML={{
                __html: text,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}