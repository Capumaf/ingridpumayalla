"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { projectDetails } from "@/data/projectDetails";

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
    typeof project.title === "string" ? project.title : project.title?.[lang];

  const text =
    typeof project.text === "string"
      ? project.text
      : project.text?.[lang] || project.text?.es || "";

  return (
    <div className="w-full flex justify-center px-6 pt-10 pb-24">
      <div className="w-full max-w-5xl">
        {/* BACK */}
        <div className="mb-10">
          <Link
            href={`/${lang}/works`}
            className="text-xs text-neutral-400 hover:text-black transition-colors"
          >
            ← {lang === "es" ? "Volver a trabajos" : "Back to works"}
          </Link>
        </div>

        {/* COVER */}
        {cover && (
          <div className="flex justify-center">
            <Link
              href={`/${lang}/works/${id}/${cover.id}`}
              className="relative group inline-block overflow-hidden"
              aria-label={lang === "es" ? "Ver serie" : "View series"}
            >
              <img
                src={cover.src}
                alt={title || ""}
                className="
                  h-auto
                  max-w-[640px]
                  max-h-[72vh]
                  object-contain
                  cursor-zoom-in
                  transition-all
                  duration-700
                  ease-out
                  group-hover:scale-[1.01]
                  group-hover:brightness-[1.03]
                  opacity-0
                  animate-fadeIn
                "
              />

              {/* HOVER OVERLAY */}
              <div
                className="
                  absolute
                  inset-0
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  duration-700
                  pointer-events-none
                "
              >
                {/* WINDOW FRAME */}
                <div className="absolute inset-5 border border-white/15" />

                {/* LABEL */}
                <div
                  className="
                    absolute
                    bottom-7
                    left-7
                    flex
                    items-center
                    gap-3
                    translate-y-2
                    group-hover:translate-y-0
                    transition-transform
                    duration-700
                    mix-blend-difference
                  "
                >
                  <div className="w-10 h-px bg-white/80" />

                  <span
                    className="
                      text-[10px]
                      tracking-[0.22em]
                      uppercase
                      text-white/95
                    "
                  >
                    {lang === "es" ? "Ver series" : "View series"}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* TEXT BLOCK */}
        <div className="max-w-[620px] mx-auto mt-32 md:translate-x-6">
          <h1 className="text-[28px] leading-tight tracking-[0.04em] mb-24 text-center">
            {title}
          </h1>

          {text && (
            <div
              className="body-text text-justify"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
        </div>
      </div>
    </div>
  );
}