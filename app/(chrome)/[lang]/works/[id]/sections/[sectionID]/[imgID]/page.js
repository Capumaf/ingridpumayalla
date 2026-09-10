"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import { projectDetails } from "@/data/projectDetails";
import { getImageDims } from "@/lib/imageDimensions";
import { stripHtml } from "@/lib/metadata";

export default function SectionMediaPage() {
  const { id, sectionID, imgID } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const [visible, setVisible] = useState(false);

  const lang = pathname.startsWith("/es") ? "es" : "en";
  const project = projectDetails[id];

  const section = project?.sections?.find((item) => item.id === sectionID);

  useEffect(() => {
    const footer = document.querySelector("footer");

    if (footer) footer.style.display = "none";

    const t = requestAnimationFrame(() => setVisible(true));

    return () => {
      cancelAnimationFrame(t);
      if (footer) footer.style.display = "";
    };
  }, []);

  if (!project || !section || !section.mediaData) {
    return <div>Section not found.</div>;
  }

  const media = section.mediaData;
  const currentIndex = media.findIndex((item) => item.id === imgID);

  if (currentIndex === -1) {
    return <div>Media not found.</div>;
  }

  const item = media[currentIndex];
  const prevItem = media[currentIndex - 1] || null;
  const nextItem = media[currentIndex + 1] || null;
  const firstVideo = section.videoData?.[0] || null;

  const videoHref = firstVideo
    ? `/${lang}/works/${id}/sections/${sectionID}/videos/${firstVideo.id}`
    : null;

  const sectionHref = `/${lang}/works/${id}/sections/${sectionID}`;

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(sectionHref);
    }
  };

  const goToItem = (target) => {
    router.push(`/${lang}/works/${id}/sections/${sectionID}/${target.id}`);
  };

  useEffect(() => {
    [prevItem?.src, nextItem?.src].forEach((src) => {
      if (!src || src.endsWith(".mp4")) return;
      const image = new window.Image();
      image.src = src;
    });
  }, [prevItem?.src, nextItem?.src]);

  useEffect(() => {
    if (prevItem) {
      router.prefetch(`/${lang}/works/${id}/sections/${sectionID}/${prevItem.id}`);
    }

    if (nextItem) {
      router.prefetch(`/${lang}/works/${id}/sections/${sectionID}/${nextItem.id}`);
    }
  }, [router, lang, id, sectionID, prevItem, nextItem]);

  const artworkDetails =
    section.artworkDetails?.[lang] ||
    section.artworkDetails?.en ||
    [];

  const description = artworkDetails[currentIndex] || "";

  const brRegex = /<br\s*\/?>/i;
  const descParts = description.split(brRegex);
  const descTitle = descParts[0] || "";
  const descRest = descParts.slice(1).join("<br />");

  const sectionTitle =
    typeof section.title === "string"
      ? section.title
      : section.title?.[lang] || section.title?.es || "";

  const imageAlt = stripHtml(description) || sectionTitle || "Artwork image";

  const isVideo = item.src?.endsWith(".mp4");
  const { width: itemWidth, height: itemHeight } = isVideo
    ? { width: 0, height: 0 }
    : getImageDims(item.src);

  const renderMedia = (className, sizes) =>
    isVideo ? (
      <video
        src={item.src}
        autoPlay
        muted
        loop
        playsInline
        className={className}
      />
    ) : (
      <Image
        src={item.src}
        alt={imageAlt}
        width={itemWidth}
        height={itemHeight}
        priority
        sizes={sizes}
        className={className}
      />
    );

  return (
    <>
      {!isVideo && (
        <Head>
          <link rel="preload" as="image" href={item.src} />
        </Head>
      )}

      <div
        className="fixed inset-0 flex items-center justify-center bg-white"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 300ms ease",
        }}
      >
        {/* MOBILE */}
        <div className="flex md:hidden flex-col w-full h-full px-5 pt-6 pb-8 justify-center gap-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
            >
              ← {lang === "es" ? "Atrás" : "Back"}
            </button>
          </div>

          <div
            className="w-full"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(-10px)",
              transition: "opacity 400ms ease 80ms, transform 400ms ease 80ms",
            }}
          >
            {renderMedia("object-contain w-full max-h-[55vh]", "100vw")}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => prevItem && goToItem(prevItem)}
              aria-label={lang === "es" ? "Anterior" : "Previous"}
              className={`z-50 px-4 py-3 text-2xl leading-none text-gray-500 hover:text-[#b7623b] ${
                prevItem ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              ←
            </button>

            {!nextItem ? (
              videoHref ? (
                <Link
                  href={videoHref}
                  aria-label={lang === "es" ? "Siguiente video" : "Next video"}
                  className="z-50 px-4 py-3 text-2xl leading-none text-gray-500 hover:text-[#b7623b]"
                >
                  →
                </Link>
              ) : (
                <Link
                  href={sectionHref}
                  className="z-50 px-4 py-3 text-xs tracking-widest text-gray-500 hover:text-black"
                >
                  {lang === "es" ? "Volver a sección" : "Back to section"} →
                </Link>
              )
            ) : (
              <button
                type="button"
                onClick={() => goToItem(nextItem)}
                aria-label={lang === "es" ? "Siguiente" : "Next"}
                className="z-50 px-4 py-3 text-2xl leading-none text-gray-500 hover:text-[#b7623b]"
              >
                →
              </button>
            )}
          </div>

          <div>
            <p className="text-xs text-neutral-400 tracking-widest mb-1">
              {sectionTitle}
            </p>
            {descTitle && (
              <p className="text-xs text-neutral-700 font-medium mb-1">
                {descTitle}
              </p>
            )}

            {descRest && (
              <div
                className="text-xs text-neutral-600 leading-relaxed text-left"
                dangerouslySetInnerHTML={{
                  __html: descRest,
                }}
              />
            )}
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:grid w-full max-w-6xl px-10 pl-14 lg:pl-20 grid-cols-[180px_1fr] gap-10 items-start">
          {/* LEFT DETAILS */}
          <div
            className="text-sm text-gray-800 flex flex-col pt-2 ml-8"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(-8px)",
              transition: "opacity 400ms ease 100ms, transform 400ms ease 100ms",
            }}
          >
            <button
              type="button"
              onClick={goBack}
              className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
            >
              ← {lang === "es" ? "Atrás" : "Back"}
            </button>

            <div className="mt-6">
              <h2 className="text-base font-semibold mb-1">
                {sectionTitle}
              </h2>

                {descTitle && (
                  <p className="text-sm text-neutral-700 font-medium mb-1">
                    {descTitle}
                  </p>
                )}

                {descRest && (
                  <div
                    className="mb-6 text-sm leading-relaxed text-neutral-600 text-left"
                    dangerouslySetInnerHTML={{
                      __html: descRest,
                    }}
                  />
                )}
            </div>
          </div>

          {/* MEDIA */}
          <div
            className="relative w-full flex justify-center pb-16"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(-10px)",
              transition: "opacity 400ms ease 50ms, transform 400ms ease 50ms",
            }}
          >
            <button
              onClick={() => prevItem && goToItem(prevItem)}
              aria-label={lang === "es" ? "Anterior" : "Previous"}
              className={`absolute left-[-52px] top-1/2 -translate-y-1/2 text-5xl text-gray-600 hover:text-[#b7623b] ${
                prevItem ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              ‹
            </button>

            {renderMedia("object-contain max-h-[78vh] w-auto max-w-full", "80vw")}

            <button
              onClick={() =>
                nextItem
                  ? goToItem(nextItem)
                  : videoHref
                  ? router.push(videoHref)
                  : router.push(sectionHref)
              }
              aria-label={lang === "es" ? "Siguiente" : "Next"}
              className={`absolute right-[-52px] top-1/2 -translate-y-1/2 text-5xl text-gray-600 hover:text-[#b7623b] ${
                nextItem || videoHref ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              ›
            </button>

            {!nextItem && !videoHref && (
              <Link
                href={`/${lang}/works`}
                className="absolute right-0 -bottom-8 text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
              >
                {lang === "es" ? "Volver a obras" : "Back to works"} →
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}