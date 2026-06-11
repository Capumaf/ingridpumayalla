"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { projectDetails } from "../../../../../data/projectDetails";

export default function ImagePage() {
  const { id, imgID } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const [visible, setVisible] = useState(false);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchCurrentX = useRef(0);
  const touchCurrentY = useRef(0);
  const touchEndX = useRef(0);
  const isSwiping = useRef(false);

  const lang = pathname.startsWith("/es") ? "es" : "en";
  const project = projectDetails[id];

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

  if (!project || !project.imageData) {
    return <div>Proyecto no encontrado.</div>;
  }

  const images = project.imageData;
  const currentIndex = images.findIndex((i) => i.id === imgID);

  if (currentIndex === -1) {
    return <div>Imagen no encontrada.</div>;
  }

  const img = images[currentIndex];
  const prevImg = images[currentIndex - 1] || null;
  const nextImg = images[currentIndex + 1] || null;
  const firstVideo = project.videoData?.[0] || null;

  const nextVideoHref =
  firstVideo && !nextImg
    ? `/${lang}/works/${id}/videos/${firstVideo.id}`
    : null;

const externalVideoHref =
  firstVideo && !nextImg && firstVideo.externalOnly
    ? firstVideo.fullVideoUrl
    : null;

  const artworkDetails =
  project.artworkDetails?.[lang] ||
  project.artworkDetails?.en ||
  [];

const description =
  artworkDetails[currentIndex] || "";

  const handleTouchStart = (e) => {
    const touch = e.changedTouches[0];

    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    touchCurrentX.current = touch.clientX;
    touchCurrentY.current = touch.clientY;

    isSwiping.current = false;
  };

  const handleTouchMove = (e) => {
    const touch = e.changedTouches[0];

    touchCurrentX.current = touch.clientX;
    touchCurrentY.current = touch.clientY;
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];

    touchEndX.current = touch.clientX;

    const finalX = touchCurrentX.current || touchEndX.current;
    const finalY = touchCurrentY.current || touch.clientY;

    const deltaX = touchStartX.current - finalX;
    const deltaY = touchStartY.current - finalY;

    const isHorizontalSwipe =
      Math.abs(deltaX) > 45 &&
      Math.abs(deltaX) > Math.abs(deltaY);

    if (!isHorizontalSwipe) return;

    isSwiping.current = true;

    if (deltaX > 0 && nextImg) {
      router.push(`/${lang}/works/${id}/${nextImg.id}`);
    }

    if (deltaX < 0 && prevImg) {
      router.push(`/${lang}/works/${id}/${prevImg.id}`);
    }
  };

  useEffect(() => {
    [prevImg?.src, nextImg?.src].forEach((src) => {
      if (!src) return;
      const image = new window.Image();
      image.src = src;
    });
  }, [prevImg?.src, nextImg?.src]);

  useEffect(() => {
    if (prevImg) router.prefetch(`/${lang}/works/${id}/${prevImg.id}`);
    if (nextImg) router.prefetch(`/${lang}/works/${id}/${nextImg.id}`);
  }, [router, lang, id, prevImg, nextImg]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-white"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
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
            href={`/${lang}/works/${id}`}
             className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
          >
            ← {lang === "es" ? "Volver al proyecto" : "Back to project"}
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
          <img
            src={img.src}
            alt="Artwork image"
            draggable={false}
            className="object-contain w-full max-h-[55vh] select-none touch-pan-y"
          />
        </div>

        <div className="flex items-center justify-between">
  <button
    type="button"
    onClick={() => {
      if (prevImg) router.push(`/${lang}/works/${id}/${prevImg.id}`);
    }}
    className={`z-50 px-4 py-3 text-2xl leading-none text-gray-500 hover:text-[#b7623b] ${
      prevImg ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
  >
    ←
  </button>

{nextImg ? (
  <button
    type="button"
    onClick={() => {
      router.push(`/${lang}/works/${id}/${nextImg.id}`);
    }}
    className="z-50 px-4 py-3 text-2xl leading-none text-gray-500 hover:text-[#b7623b]"
  >
    →
  </button>
) : nextVideoHref ? (
  <button
    type="button"
    onClick={() => router.push(nextVideoHref)}
    className="z-50 px-4 py-3 text-2xl leading-none text-gray-500 hover:text-[#b7623b]"
  >
    →
  </button>
) : (
  <Link
    href={`/${lang}/works`}
    className="z-50 px-4 py-3 text-xs tracking-widest text-gray-500 hover:text-black"
  >
    {lang === "es" ? "Volver a obras" : "Back to works"} →
  </Link>
)}
</div>

        {description && (
          <div>
            <p className="text-xs text-neutral-400 tracking-widest mb-1">
              {lang === "es" ? "Detalles de la obra" : "Artwork Details"}
            </p>

            <div
              className="text-xs text-neutral-600 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
          </div>
        )}
      </div>

      {/* DESKTOP */}
      <div className="hidden md:grid w-full max-w-7xl px-10 pl-14 lg:pl-20 grid-cols-[260px_1fr] gap-14 items-start">
        {/* LEFT DETAILS */}
        <div
          className="text-sm text-gray-800 flex flex-col pt-2 ml-28"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-8px)",
            transition: "opacity 700ms ease 150ms, transform 700ms ease 150ms",
          }}
        >
          <Link
            href={`/${lang}/works/${id}`}
            className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
          >
            ← {lang === "es" ? "Volver al proyecto" : "Back to project"}
          </Link>

          {description && (
            <div className="mt-6 max-w-[340px]">
              <h2 className="text-[15px] font-semibold mb-4 tracking-[0.01em]">
                {lang === "es" ? "Detalles de la obra" : "Artwork Details"}
              </h2>

              <div
                className="mb-6 text-[12px] leading-[1.70] tracking-[0.005em] text-neutral-700 text-left"
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              />
            </div>
          )}
        </div>

        {/* IMAGE */}
        <div
          className="relative w-full flex justify-center pb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-10px)",
            transition: "opacity 800ms ease 80ms, transform 800ms ease 80ms",
          }}
        >
          <button
            onClick={() =>
              prevImg && router.push(`/${lang}/works/${id}/${prevImg.id}`)
            }
            className={`absolute left-[-52px] top-1/2 -translate-y-1/2 text-5xl text-gray-600 hover:text-[#b7623b] ${
    
              prevImg ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            ‹
          </button>

          <img
            src={img.src}
            alt="Artwork image"
            draggable={false}
            className="object-contain max-h-[78vh] w-auto max-w-full select-none"
          />

          <button
            onClick={() =>
              nextImg
                ? router.push(`/${lang}/works/${id}/${nextImg.id}`)
                : nextVideoHref
                ? router.push(nextVideoHref)
                : externalVideoHref
                ? window.open(externalVideoHref, "_blank")
                : router.push(`/${lang}/works/${id}`)

            }
            className={`absolute right-[-52px] top-1/2 -translate-y-1/2 text-5xl text-gray-600 hover:text-[#b7623b] ${
              nextImg || nextVideoHref || externalVideoHref ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            ›
          </button>

          {!nextImg && !nextVideoHref && (
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