"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import { WORK_ORDER } from "../../../../../data/worksOrder";
import { projectDetails } from "../../../../../data/projectDetails";

export default function ImagePage() {
  const { id, imgID } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const lang = pathname.startsWith("/es") ? "es" : "en";

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
  const currentIndex = images.findIndex((i) => i.id === imgID);
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

  const labels = {
    backToWork: lang === "es" ? "← Volver al proyecto" : "← Back to project",
    backToWorks: lang === "es" ? "← Volver a trabajos" : "← Back to works",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="w-full max-w-6xl px-10 flex items-stretch gap-14">

        {/* LEFT */}
        <div className="relative w-[220px] text-sm text-gray-800 flex flex-col">

          <Link
            href={`/${lang}/works/${id}`}
            className="text-xs tracking-widest text-gray-500 hover:text-black"
          >
            {labels.backToWork}
          </Link>

          <div className="mt-6">
            <h2 className="text-base font-semibold mb-1">
              {lang === "es" ? "Descripción técnica" : "Technical description"}
            </h2>

            <p className="mb-6">{description}</p>
          </div>

          <Link
            href={`/${lang}/works`}
            className="absolute left-0 -bottom-2 text-xs tracking-widest text-gray-500 hover:text-black"
          >
            {labels.backToWorks}
          </Link>

        </div>

        {/* IMAGE */}
        <div className="relative w-full max-w-[720px] flex justify-center flex-col">

          {prevImg && (
            <button
              onClick={() => router.push(`/${lang}/works/${id}/${prevImg.id}`)}
              className="hidden md:block absolute left-[-60px] top-1/2 -translate-y-1/2 text-5xl text-gray-600 hover:text-black"
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

          {(nextImg || nextWorkId) && (
            <button
              onClick={() =>
                nextImg
                  ? router.push(`/${lang}/works/${id}/${nextImg.id}`)
                  : router.push(`/${lang}/works/${nextWorkId}`)
              }
              className="hidden md:block absolute right-[-60px] top-1/2 -translate-y-1/2 text-5xl text-gray-600 hover:text-black"
            >
              ›
            </button>
          )}

          {/* MOBILE NAV */}
          <div className="flex md:hidden w-full items-center justify-between mt-3 px-1">

            <button
              onClick={() =>
                prevImg && router.push(`/${lang}/works/${id}/${prevImg.id}`)
              }
              className={`text-5xl text-gray-600 ${
                prevImg ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              ‹
            </button>

            <button
              onClick={() =>
                nextImg
                  ? router.push(`/${lang}/works/${id}/${nextImg.id}`)
                  : nextWorkId
                  ? router.push(`/${lang}/works/${nextWorkId}`)
                  : null
              }
              className={`text-5xl text-gray-600 ${
                nextImg || nextWorkId
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              ›
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}