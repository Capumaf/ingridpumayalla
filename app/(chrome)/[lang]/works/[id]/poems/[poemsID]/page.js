"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

import { projectDetails } from "@/data/projectDetails";

export default function PoemPage() {
  const { id, poemsID } = useParams();
  const pathname = usePathname();

  const lang = pathname.startsWith("/es") ? "es" : "en";

  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const endRef = useRef(null);

  const project = projectDetails[id];

  const poem = project?.poems?.find(
    (item) => item.id === poemsID
  );

  const poemIndex =
    project?.poems?.findIndex((item) => item.id === poemsID) ?? -1;

  const prevPoem = poemIndex > 0 ? project?.poems?.[poemIndex - 1] : null;

  const workHref = `/${lang}/works/${id}`;
  const prevHref = prevPoem
    ? `/${lang}/works/${id}/poems/${prevPoem.id}`
    : workHref;

  const firstImage = project?.imageData?.[0];
  const imageHref = firstImage
    ? `/${lang}/works/${id}/${firstImage.id}`
    : workHref;

  const getLocalizedText = (value) => {
    if (typeof value === "string") return value;
    return value?.[lang] || value?.es || value?.en || "";
  };

  const prevLabel = prevPoem
    ? getLocalizedText(prevPoem.title)
    : lang === "es"
      ? "Volver a obra"
      : "Back to work";

  useEffect(() => {
    setHasReachedEnd(false);

    if (!endRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasReachedEnd(true);
      },
      { threshold: 0 }
    );

    observer.observe(endRef.current);

    return () => observer.disconnect();
  }, [poemsID]);

  if (!project || !poem) {
    return (
      <div className="px-6 pt-20">
        <p className="text-sm text-neutral-500">
          {lang === "es"
            ? "Poema no encontrado"
            : "Poem not found"}
        </p>
      </div>
    );
  }

  const title =
    typeof poem.title === "string"
      ? poem.title
      : poem.title?.[lang] ||
        poem.title?.es ||
        "";

  const text =
    typeof poem.text === "string"
      ? poem.text
      : poem.text?.[lang] ||
        poem.text?.es ||
        "";

  return (
    <article className="w-full pt-8 pb-24">

      {/* BACK BUTTON */}
      <div className="px-6 md:ml-[20rem]">
        <Link
          href={prevHref}
          className="
            text-[11px]
            tracking-[0.18em]
            text-neutral-500
             hover:text-[#b7623b]
            transition-colors
          "
        >
          ← {prevLabel}
        </Link>
      </div>

      {/* POEM COLUMN */}
      <div
        className="
          px-6
          pt-12
          max-w-[560px]
          md:ml-[30rem]
        "
      >

        <header className="mb-16">

          <p
            className="
              mb-5
              text-[11px]
              uppercase
              tracking-[0.24em]
              text-neutral-400
            "
          >
            {project.title}
          </p>

          <h1
            className="
              text-[42px]
              leading-none
              tracking-[0.02em]
              font-normal
            "
          >
            {title}
          </h1>

        </header>

        <div
          className="
            body-text
            text-[15px]
            leading-[2.15]
            text-left
          "
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        />

        <div ref={endRef} />

        {hasReachedEnd && (
          <div className="mt-12 flex justify-end">
            <Link
              href={imageHref}
              className="
                text-[11px]
                tracking-[0.18em]
                text-neutral-500
                hover:text-[#b7623b]
                transition-colors
              "
            >
              {lang === "es" ? "Ver obra" : "View work"} →
            </Link>
          </div>
        )}

      </div>

    </article>
  );
}
