"use client";

import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { projectDetails } from "../../../../data/projectDetails";

export default function WorkPage() {
  const { id } = useParams();
  const pathname = usePathname();
  const lang = pathname.startsWith("/es") ? "es" : "en";

  const project = projectDetails[id];

  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!project || !project.imageData?.length) {
    return <div>Project not found</div>;
  }

  const images = project.imageData;
  const cover = images[0];
  const currentImage = images[index];
  const description = project.description?.[lang] || "";

  const prevImage = () => {
    setIndex((current) => (current > 0 ? current - 1 : current));
  };

  const nextImage = () => {
    setIndex((current) =>
      current < images.length - 1 ? current + 1 : current
    );
  };

  return (
    <>
      <div className="h-full flex flex-col items-center justify-center px-6 gap-4">
        <div className="w-full max-w-2xl">
          <Link
            href={`/${lang}/works`}
            className="text-xs text-neutral-400 hover:text-black"
          >
            ← {lang === "es" ? "Volver" : "Back"}
          </Link>
        </div>

        <h1 className="text-2xl font-normal tracking-[0.15em] text-center">
          {project.title?.[lang]}
        </h1>

        <button
          onClick={() => {
            setIndex(0);
            setIsOpen(true);
          }}
          className="w-full max-w-2xl cursor-pointer"
        >
          <img
            src={cover.src}
            alt={project.title?.[lang] || ""}
            className="w-full max-h-[70vh] object-contain"
          />
        </button>

        {description && (
          <p className="text-xs text-neutral-500 text-center max-w-lg">
            {description}
          </p>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 left-6 text-xs tracking-widest text-gray-500 hover:text-black"
          >
            ← {lang === "es" ? "Volver al proyecto" : "Back to project"}
          </button>

          <button
            onClick={prevImage}
            className={`absolute left-6 md:left-12 top-1/2 -translate-y-1/2 text-5xl text-gray-600 hover:text-black ${
              index > 0 ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            ‹
          </button>

          <img
            src={currentImage.src}
            alt={project.title?.[lang] || ""}
            className="max-w-[85vw] max-h-[85vh] object-contain"
          />

          <button
            onClick={nextImage}
            className={`absolute right-6 md:right-12 top-1/2 -translate-y-1/2 text-5xl text-gray-600 hover:text-black ${
              index < images.length - 1
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}