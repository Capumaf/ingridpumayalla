"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Head from "next/head";

import { residencyDetails } from "@/data/residencyDetails";

export default function ResidencyImagePage() {
  const { id, imgID } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const [visible, setVisible] = useState(false);

  const lang = pathname.startsWith("/es") ? "es" : "en";
  const residency = residencyDetails[id];

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";

    const t = requestAnimationFrame(() => setVisible(true));

    return () => {
      cancelAnimationFrame(t);
      if (footer) footer.style.display = "";
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

  const residencyDetail =
    residency.residencyDetails?.[lang]?.[currentIndex] ||
    residency.residencyDetails?.en?.[currentIndex] ||
    "";

  const detailsTitle =
    lang === "es" ? "Detalles de la residencia" : "Residency Details";

  return (
    <>
      <Head>
        <link rel="preload" as="image" href={img.src} />
      </Head>

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
            <Link
              href={`/${lang}/residencies/${id}`}
              className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
            >
              ← {lang === "es" ? "Volver a residencia" : "Back to residency"}
            </Link>
          </div>

          <div
            className="w-full"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(-10px)",
              transition: "opacity 400ms ease 80ms, transform 400ms ease 80ms",
            }}
          >
            <img
              src={img.src}
              alt={residency.title || "Residency image"}
              draggable={false}
              className="object-contain w-full max-h-[55vh] select-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => prevImg && router.push(`/${lang}/residencies/${id}/${prevImg.id}`)}
              className={`z-50 px-4 py-3 text-2xl leading-none text-gray-500 hover:text-[#b7623b] ${
                prevImg ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              ←
            </button>

            {!nextImg ? (
              <Link
                href={`/${lang}/residencies`}
                className="z-50 px-4 py-3 text-xs tracking-widest text-gray-500 hover:text-black"
              >
                {lang === "es" ? "Volver a residencias" : "Back to residencies"} →
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => router.push(`/${lang}/residencies/${id}/${nextImg.id}`)}
                className="z-50 px-4 py-3 text-2xl leading-none text-gray-500 hover:text-[#b7623b]"
              >
                →
              </button>
            )}
          </div>

          <div>
            <p className="text-xs text-neutral-400 tracking-widest mb-1">
              {detailsTitle}
            </p>

            <div
              className="text-xs text-neutral-600 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: residencyDetail || residency.introduction || residency.title,
              }}
            />

            {residency.audio && (
              <div className="mt-4">
                <audio controls className="w-full">
                  <source src={residency.audio.src} type="audio/mp4" />
                </audio>
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:flex w-full max-w-6xl px-10 pl-16 items-stretch gap-14">
          <div
            className="w-[220px] text-sm text-gray-800 flex flex-col ml-3"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(-8px)",
              transition: "opacity 400ms ease 100ms, transform 400ms ease 100ms",
            }}
          >
            <Link
              href={`/${lang}/residencies/${id}`}
              className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
            >
              ← {lang === "es" ? "Volver a residencia" : "Back to residency"}
            </Link>

            <div className="mt-6">
              <h2 className="text-base font-semibold mb-1">{detailsTitle}</h2>

              <p className="mb-3 text-neutral-500">{residency.title}</p>

              <div
                className="mb-6"
                dangerouslySetInnerHTML={{
                  __html: residencyDetail || residency.introduction || "",
                }}
              />

              {residency.audio && (
                <div className="mt-6">
                  <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-neutral-400">
                    Audio
                  </p>
                  <audio controls className="w-full max-w-[220px]">
                    <source src={residency.audio.src} type="audio/mp4" />
                  </audio>
                </div>
              )}
            </div>
          </div>

          <div
            className="relative w-full max-w-[720px] flex justify-center flex-col"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(-10px)",
              transition: "opacity 400ms ease 50ms, transform 400ms ease 50ms",
            }}
          >
            <button
              onClick={() => prevImg && router.push(`/${lang}/residencies/${id}/${prevImg.id}`)}
              className={`absolute left-[-60px] top-1/2 -translate-y-1/2 text-5xl text-gray-600 hover:text-[#b7623b] ${
                prevImg ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              ‹
            </button>

            <img
              src={img.src}
              alt={residency.title || "Residency image"}
              draggable={false}
              className="object-contain max-h-[85vh] rounded-lg w-full select-none"
            />

            <button
              onClick={() =>
                nextImg
                  ? router.push(`/${lang}/residencies/${id}/${nextImg.id}`)
                  : router.push(`/${lang}/residencies/${id}`)
              }
              className={`absolute right-[-60px] top-1/2 -translate-y-1/2 text-5xl text-gray-600 hover:text-[#b7623b] ${
                nextImg ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              ›
            </button>

            {!nextImg && (
              <Link
                href={`/${lang}/residencies`}
                className="absolute right-0 -bottom-8 text-xs tracking-widest text-gray-500 hover:text-[#b7623b]"
              >
                {lang === "es" ? "Volver a residencias" : "Back to residencies"} →
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}