"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

import { residencyDetails } from "@/data/residencyDetails";

export default function ResidencyImagePage() {
  const { id, imgID } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  

  const lang = pathname.startsWith("/es") ? "es" : "en";
  const residency = residencyDetails[id];

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

  if (!residency || !residency.imageData) {
    return <div>Residency not found.</div>;
  }

  const images = residency.imageData;
  const currentIndex = images.findIndex((i) => i.id === imgID);

  if (currentIndex === -1) {
    return <div>Image not found.</div>;
  }

  const img = images[currentIndex];
  const prevImg = images[currentIndex - 1] || null;
  const nextImg = images[currentIndex + 1] || null;
  const handleTouchStart = (e) => {
  touchStartX.current = e.changedTouches[0].clientX;
};

const handleTouchEnd = (e) => {
  touchEndX.current = e.changedTouches[0].clientX;

  const distance = touchStartX.current - touchEndX.current;

  if (distance > 60 && nextImg) {
    router.push(`/${lang}/residencies/${id}/${nextImg.id}`);
  }

  if (distance < -60 && prevImg) {
    router.push(`/${lang}/residencies/${id}/${prevImg.id}`);
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
    if (prevImg) router.prefetch(`/${lang}/residencies/${id}/${prevImg.id}`);
    if (nextImg) router.prefetch(`/${lang}/residencies/${id}/${nextImg.id}`);
  }, [router, lang, id, prevImg, nextImg]);

  const description =
    img.description?.[lang] ??
    (typeof img.description === "string" ? img.description : "");

  const detailsTitle =
    lang === "es" ? "Detalles de la residencia" : "Residency Details";

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
            href={`/${lang}/residencies/${id}`}
            className="text-xs tracking-widest text-gray-500 hover:text-black"
          >
            ← {lang === "es" ? "Volver a residencia" : "Back to residency"}
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
            alt={description || residency.title || "Residency image"}
            className="object-contain w-full max-h-[55vh]"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() =>
              prevImg &&
              router.push(`/${lang}/residencies/${id}/${prevImg.id}`)
            }
            className={`text-xs tracking-widest text-gray-500 hover:text-black ${
              prevImg ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            ←
          </button>

          {!nextImg ? (
            <Link
              href={`/${lang}/residencies`}
              className="text-xs tracking-widest text-gray-500 hover:text-black"
            >
              {lang === "es" ? "Volver a residencias" : "Back to residencies"} →
            </Link>
          ) : (
            <button
              onClick={() =>
                router.push(`/${lang}/residencies/${id}/${nextImg.id}`)
              }
              className="text-xs tracking-widest text-gray-500 hover:text-black"
            >
              →
            </button>
          )}
        </div>

        <div>
          <p className="text-xs text-neutral-400 tracking-widest mb-1">
            {detailsTitle}
          </p>
          <p className="text-xs text-neutral-600 leading-relaxed">
            {description || residency.introduction || residency.title}
          </p>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex w-full max-w-6xl px-10 pl-16 items-stretch gap-14">
        <div
          className="w-[220px] text-sm text-gray-800 flex flex-col ml-3"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-8px)",
            transition: "opacity 700ms ease 150ms, transform 700ms ease 150ms",
          }}
        >
          <Link
            href={`/${lang}/residencies/${id}`}
            className="text-xs tracking-widest text-gray-500 hover:text-black"
          >
            ← {lang === "es" ? "Volver a residencia" : "Back to residency"}
          </Link>

          <div className="mt-6">
            <h2 className="text-base font-semibold mb-1">
              {detailsTitle}
            </h2>

            <p className="mb-3 text-neutral-500">
              {residency.title}
            </p>

            <p className="mb-6">
              {description || residency.introduction || ""}
            </p>
          </div>
        </div>

        <div
          className="relative w-full max-w-[720px] flex justify-center flex-col"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-10px)",
            transition: "opacity 800ms ease 80ms, transform 800ms ease 80ms",
          }}
        >
          <button
            onClick={() =>
              prevImg &&
              router.push(`/${lang}/residencies/${id}/${prevImg.id}`)
            }
            className={`absolute left-[-60px] top-1/2 -translate-y-1/2 text-5xl text-gray-600 hover:text-black ${
              prevImg ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            ‹
          </button>

          <img
            src={img.src}
            alt={description || residency.title || "Residency image"}
            className="object-contain max-h-[85vh] rounded-lg w-full"
          />

          <button
            onClick={() =>
              nextImg
                ? router.push(`/${lang}/residencies/${id}/${nextImg.id}`)
                : router.push(`/${lang}/residencies/${id}`)
            }
            className={`absolute right-[-60px] top-1/2 -translate-y-1/2 text-5xl text-gray-600 hover:text-black ${
              nextImg ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            ›
          </button>

          {!nextImg && (
            <Link
              href={`/${lang}/residencies`}
              className="absolute right-0 -bottom-8 text-xs tracking-widest text-gray-500 hover:text-black"
            >
              {lang === "es" ? "Volver a residencias" : "Back to residencies"} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}