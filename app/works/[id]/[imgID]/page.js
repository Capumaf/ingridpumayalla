"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { WORK_ORDER } from "../../../data/worksOrder";
import { projectDetails } from "../../../data/projectDetails";

export default function ImagePage() {
  const { id, imgID } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlLang = searchParams.get("lang");
  const [lang, setLang] = useState(urlLang === "en" ? "en" : "es");

  const project = projectDetails[id];

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";
    document.body.style.overflow = "hidden";
    return () => {
      if (footer) footer.style.display = "";
      document.body.style.overflow = "";
    };
  }, []);

  if (!project || !project.imageData) return <div>Proyecto no encontrado.</div>;

  const images = project.imageData;
  const currentIndex = images.findIndex((img) => img.id === imgID);
  if (currentIndex === -1) return <div>Imagen no encontrada.</div>;

  const img = images[currentIndex];
  const prevImg = images[currentIndex - 1] || null;
  const nextImg = images[currentIndex + 1] || null;

  const nextWorkId = useMemo(() => {
    const i = WORK_ORDER.indexOf(id);
    if (i === -1 || i === WORK_ORDER.length - 1) return null;
    return WORK_ORDER[i + 1];
  }, [id]);

  const description =
    img.description?.[lang] ??
    (typeof img.description === "string" ? img.description : "");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="w-full max-w-6xl px-10 flex items-start gap-14">
        {/* Left column */}
        <div className="w-[220px] text-sm text-gray-800">
          <button
            onClick={() => router.push(`/works/${id}?lang=${lang}`)}
            className="text-xs tracking-widest text-gray-500 hover:text-black transition-colors mb-6"
          >
            ← {lang === "es" ? "Regreso" : "Return"}
          </button>

          <h2 className="text-base font-semibold mb-1">
            {lang === "es" ? "Descripción técnica" : "Technical description"}
          </h2>

          <p className="mb-6">{description}</p>

          {/* Language */}
          <button
            onClick={() => {
              const newLang = lang === "es" ? "en" : "es";
              setLang(newLang);
              router.push(`/works/${id}/${imgID}?lang=${newLang}`);
            }}
            className="text-xs tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            {lang === "es" ? "EN" : "ES"}
          </button>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 items-start w-full max-w-[720px]">
          {/* Image with BIG arrows */}
          <div className="relative w-full flex justify-center">
            {/* Left arrow */}
            {prevImg && (
              <button
                onClick={() =>
                  router.push(`/works/${id}/${prevImg.id}?lang=${lang}`)
                }
                className="absolute left-[-60px] top-1/2 -translate-y-1/2 text-5xl font-light text-gray-600 hover:text-black transition-colors"
                aria-label="Previous image"
              >
                ‹
              </button>
            )}

            <Image
              src={img.src}
              alt={description || "Artwork image"}
              width={img.width ?? 1200}
              height={img.height ?? 800}
              className="object-contain max-h-[85vh] rounded-lg w-full"
              priority
            />

            {/* Right arrow */}
            {(nextImg || nextWorkId) && (
              <button
                onClick={() =>
                  nextImg
                    ? router.push(`/works/${id}/${nextImg.id}?lang=${lang}`)
                    : router.push(`/works/${nextWorkId}?lang=${lang}`)
                }
                className="absolute right-[-60px] top-1/2 -translate-y-1/2 text-5xl font-light text-gray-600 hover:text-black transition-colors"
                aria-label="Next"
              >
                ›
              </button>
            )}
          </div>

          {/* Audio */}
          {img.audio && (
            <audio controls className="w-full mt-2">
              <source src={img.audio} type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          )}
        </div>
      </div>
    </div>
  );
}
