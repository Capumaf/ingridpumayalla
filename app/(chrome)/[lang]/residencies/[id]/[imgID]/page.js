"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { projectDetails } from "@/data/projectDetails";

export default function SectionMediaPage() {
  const { id, sectionID, imgID } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const [visible, setVisible] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isMultiTouch = useRef(false);

  const lang = pathname.startsWith("/es") ? "es" : "en";
  const project = projectDetails[id];

  const section = project?.sections?.find((item) => item.id === sectionID);

  useEffect(() => {
    const footer = document.querySelector("footer");

    if (footer) footer.style.display = "none";
    document.body.style.overflow = "hidden";

    const t = requestAnimationFrame(() => setVisible(true));

    return () => {
      cancelAnimationFrame(t);
      if (footer) footer.style.display = "";
      document.body.style.overflow = "";
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

  const goToItem = (target) => {
    router.push(`/${lang}/works/${id}/sections/${sectionID}/${target.id}`);
  };

  const handleTouchStart = (e) => {
    isMultiTouch.current = e.touches.length > 1;
    if (isMultiTouch.current) return;
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (isMultiTouch.current) {
      isMultiTouch.current = false;
      return;
    }

    touchEndX.current = e.changedTouches[0].clientX;

    const distance = touchStartX.current - touchEndX.current;

    if (distance > 60 && nextItem) goToItem(nextItem);
    if (distance < -60 && prevItem) goToItem(prevItem);
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
  const description =
  artworkDetails[currentIndex] || "";

  const sectionTitle =
    typeof section.title === "string"
      ? section.title
      : section.title?.[lang] || section.title?.es || "";

    const renderMedia = (className) => (
  <img
    src={item.src}
    alt={description || sectionTitle}
    className={className}
  />
   );


  return (
    <div
  className="fixed inset-0 flex items-center justify-center bg-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 600ms ease",
      }}
    >
      {/* MOBILE */}
      <div className="flex md:hidden flex-col w-full h-full px-5 pt-6 pb-8 justify-center gap-3">
        <div className="flex items-center justify-between">
          <Link
            href={sectionHref}
            className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
          >
            ← {lang === "es" ? "Volver a sección" : "Back to section"}
          </Link>
        </div>

        <div
          className="w-full"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-10px)",
            transition: "opacity 700ms ease 100ms, transform 700ms ease 100ms",
          }}
        >
          {renderMedia("object-contain w-full max-h-[55vh]")}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => prevItem && goToItem(prevItem)}
            className={`text-xs tracking-widest text-gray-500 hover:text-[#b7623b] ${
              prevItem ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            ←
          </button>

          {!nextItem ? (
          videoHref ? (
          <Link
          href={videoHref}
          className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
          >
          →
          </Link>
          ) : (
          <Link
          href={sectionHref}
          className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
          >
          {lang === "es" ? "Volver a sección" : "Back to section"} →
          </Link>
           )
           ) : (
            <button
              onClick={() => goToItem(nextItem)}
              className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
            >
              →
            </button>
          )}
        </div>

        <div>
          <p className="text-xs text-neutral-400 tracking-widest mb-1">
            {sectionTitle}
          </p>

          {description && (
        <div
        className="text-xs text-neutral-600 leading-relaxed"
        dangerouslySetInnerHTML={{
                                  __html: description,
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
            transition: "opacity 700ms ease 150ms, transform 700ms ease 150ms",
          }}
        >
          <Link
            href={sectionHref}
            className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
          >
            ← {lang === "es" ? "Volver a sección" : "Back to section"}
          </Link>

          <div className="mt-6">
            <h2 className="text-base font-semibold mb-1">
              {sectionTitle}
            </h2>


            {description && (
  <div
    className="mb-6 text-sm leading-relaxed text-neutral-600"
    dangerouslySetInnerHTML={{
      __html: description,
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
            transition: "opacity 800ms ease 80ms, transform 800ms ease 80ms",
          }}
        >
          <button
            onClick={() => prevItem && goToItem(prevItem)}
            className={`absolute left-[-52px] top-1/2 -translate-y-1/2 text-5xl text-gray-600 hover:text-[#b7623b] ${
              prevItem ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            ‹
          </button>

          {renderMedia("object-contain max-h-[78vh] w-auto max-w-full")}

          <button
          onClick={() =>
          nextItem
          ? goToItem(nextItem)
          : videoHref
          ? router.push(videoHref)
          : router.push(sectionHref)
          }
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
  );
}