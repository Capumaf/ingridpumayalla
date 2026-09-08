"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

import { residencyDetails } from "@/data/residencyDetails";

export default function ResidencyPoemPage() {
  const { id, poemId } = useParams();
  const pathname = usePathname();

  const lang = pathname.startsWith("/es") ? "es" : "en";

  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const endRef = useRef(null);

  const residency = residencyDetails[id];
  const poem = residency?.poems?.find((p) => p.id === poemId);

  const poemIndex =
    residency?.poems?.findIndex((p) => p.id === poemId) ?? -1;

  const prevPoem = poemIndex > 0 ? residency?.poems?.[poemIndex - 1] : null;

  const residencyHref = `/${lang}/residencies/${id}`;

  const firstImage = residency?.imageData?.[0];
  const imageHref = firstImage
    ? `/${lang}/residencies/${id}/${firstImage.id}`
    : residencyHref;

  const getLocalizedText = (value) => {
    if (typeof value === "string") return value;
    return value?.[lang] || value?.es || value?.en || "";
  };

  const residencyTitle = getLocalizedText(residency?.title);

  const prevHref = prevPoem
    ? `/${lang}/residencies/${id}/poems/${prevPoem.id}`
    : residencyHref;

  const prevLabel = prevPoem
    ? getLocalizedText(prevPoem.title)
    : residencyTitle;

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
  }, [poemId]);

  if (!residency || !poem) {
    return (
      <div className="px-6 pt-20">
        <p className="text-sm text-neutral-500">
          {lang === "es" ? "Poema no encontrado" : "Poem not found"}
        </p>
      </div>
    );
  }

  const poemTitle = getLocalizedText(poem.title);
  const poemText = getLocalizedText(poem.text);

  return (
    <div className="w-full flex justify-center px-6 pt-10 pb-24">
      <div className="w-full max-w-[620px]">

        <div className="mb-8">
          <Link
            href={prevHref}
            className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b] transition-colors"
          >
            ← {prevLabel}
          </Link>
        </div>

        <div className="mb-10 text-center">
          <h1 className="text-[22px] leading-tight tracking-[0.04em]">
            {poemTitle}
          </h1>
        </div>

        {poemText && (
          <div
            className="
              body-text
              text-[13.5px]
              leading-[2]
              text-justify
            "
            dangerouslySetInnerHTML={{
              __html: poemText,
            }}
          />
        )}

        <div ref={endRef} />

        {poem.audio && (
          <div className="mt-8">
            <audio controls className="w-full">
              <source src={poem.audio.src} type="audio/mp4" />
            </audio>
          </div>
        )}

        {hasReachedEnd && (
          <div className="mt-12 flex justify-end">
            <Link
              href={imageHref}
              className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b] transition-colors"
            >
              {lang === "es" ? "Ver obra" : "View work"} →
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
