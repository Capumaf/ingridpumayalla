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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">

     {/* ── MOBILE ── */}
<div className="flex md:hidden flex-col w-full h-full px-5 pt-6 pb-8 justify-center gap-3">

  {/* Fila superior: volver al proyecto + ← prev */}
  <div className="flex items-center justify-between">
    <Link
      href={`/${lang}/works/${id}`}
      className="text-xs tracking-widest text-gray-500 hover:text-black"
    >
      ← {lang === "es" ? "Volver al proyecto" : "Back to project"}
    </Link>
    <button
      onClick={() =>
        prevImg && router.push(`/${lang}/works/${id}/${prevImg.id}`)
      }
      className={`text-xs tracking-widest text-gray-500 hover:text-black ${
        prevImg ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      ←
    </button>
  </div>

  {/* Imagen */}
  <div className="w-full">
    <Image
      src={img.src}
      alt={description || "Artwork image"}
      width={img.width ?? 1200}
      height={img.height ?? 800}
      className="object-contain w-full max-h-[55vh]"
      priority
    />
  </div>


  {/* Fila inferior: volver a trabajos + → next */}
  <div className="flex items-center justify-between">
    <Link
      href={`/${lang}/works`}
      className="text-xs tracking-widest text-gray-500 hover:text-black"
    >
      ← {lang === "es" ? "Volver a trabajos" : "Back to works"}
    </Link>
    <button
      onClick={() =>
        nextImg
          ? router.push(`/${lang}/works/${id}/${nextImg.id}`)
          : nextWorkId
          ? router.push(`/${lang}/works/${nextWorkId}`)
          : null
      }
      className={`text-xs tracking-widest text-gray-500 hover:text-black ${
        nextImg || nextWorkId ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      →
    </button>
  </div>


{/* Descripción técnica */}
<div>
  <p className="text-xs text-neutral-400 tracking-widest mb-1">
    {lang === "es" ? "Descripción técnica" : "Technical description"}
  </p>
  <p className="text-xs text-neutral-600 leading-relaxed">{description}</p>
</div>



</div>

      {/* ── DESKTOP ── intacto */}
      <div className="hidden md:flex w-full max-w-6xl px-10 items-stretch gap-14">

        {/* LEFT */}
        <div className="relative w-[220px] text-sm text-gray-800 flex flex-col">

          <Link
            href={`/${lang}/works/${id}`}
            className="text-xs tracking-widest text-gray-500 hover:text-black"
          >
            ← {lang === "es" ? "Volver al proyecto" : "Back to project"}
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
            ← {lang === "es" ? "Volver a trabajos" : "Back to works"}
          </Link>

        </div>

        {/* IMAGE */}
        <div className="relative w-full max-w-[720px] flex justify-center flex-col">

          <button
            onClick={() =>
              prevImg && router.push(`/${lang}/works/${id}/${prevImg.id}`)
            }
            className={`absolute left-[-60px] top-1/2 -translate-y-1/2 text-5xl text-gray-600 hover:text-black ${
              prevImg ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            ‹
          </button>

          <Image
            src={img.src}
            alt={description || "Artwork image"}
            width={img.width ?? 1200}
            height={img.height ?? 800}
            className="object-contain max-h-[85vh] rounded-lg w-full"
            priority
          />

          <button
            onClick={() =>
              nextImg
                ? router.push(`/${lang}/works/${id}/${nextImg.id}`)
                : nextWorkId
                ? router.push(`/${lang}/works/${nextWorkId}`)
                : null
            }
            className={`absolute right-[-60px] top-1/2 -translate-y-1/2 text-5xl text-gray-600 hover:text-black ${
              nextImg || nextWorkId ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            ›
          </button>

        </div>

      </div>

    </div>
  );
}