"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

import { projectDetails } from "@/data/projectDetails";

export default function SectionImagePage() {
  const { id, sectionID, imgID } = useParams();

  const pathname = usePathname();
  const router = useRouter();

  const [visible, setVisible] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const lang = pathname.startsWith("/es") ? "es" : "en";

  const project = projectDetails[id];

  const section = project?.sections?.find(
    (item) => item.id === sectionID
  );

  if (!project || !section || !section.mediaData) {
    return <div>Section not found.</div>;
  }

  const images = section.mediaData;

  const currentIndex = images.findIndex(
    (i) => i.id === imgID
  );

  if (currentIndex === -1) {
    return <div>Image not found.</div>;
  }

  const img = images[currentIndex];

  const prevImg = images[currentIndex - 1] || null;
  const nextImg = images[currentIndex + 1] || null;

  useEffect(() => {
    const footer = document.querySelector("footer");

    if (footer) footer.style.display = "none";

    document.body.style.overflow = "hidden";

    const t = requestAnimationFrame(() =>
      setVisible(true)
    );

    return () => {
      cancelAnimationFrame(t);

      if (footer) footer.style.display = "";

      document.body.style.overflow = "";
    };
  }, []);

  const handleTouchStart = (e) => {
    touchStartX.current =
      e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current =
      e.changedTouches[0].clientX;

    const distance =
      touchStartX.current - touchEndX.current;

    if (distance > 60 && nextImg) {
      router.push(
        `/${lang}/works/${id}/${sectionID}/${nextImg.id}`
      );
    }

    if (distance < -60 && prevImg) {
      router.push(
        `/${lang}/works/${id}/${sectionID}/${prevImg.id}`
      );
    }
  };

return (
  <div
    className="fixed inset-0 bg-white"
    onTouchStart={handleTouchStart}
    onTouchEnd={handleTouchEnd}
    style={{
      opacity: visible ? 1 : 0,
      transition: "opacity 600ms ease",
    }}
  >
    {/* MOBILE */}
    <div className="flex md:hidden flex-col h-full overflow-y-auto">
      <div className="px-5 pt-6 pb-4">
        <Link
          href={`/${lang}/works/${id}/${sectionID}`}
          className="text-[10px] tracking-[0.18em] uppercase text-neutral-500"
        >
          ← Back
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="relative w-full flex justify-center">
          {/* PREV */}
          <button
            onClick={() =>
              prevImg &&
              router.push(
                `/${lang}/works/${id}/${sectionID}/${prevImg.id}`
              )
            }
            className={`
              absolute
              left-[-4px]
              top-1/2
              -translate-y-1/2
              text-4xl
              text-neutral-500
              z-20

              ${
                prevImg
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }
            `}
          >
            ‹
          </button>

          {/* MEDIA */}
          {img.type === "video" ? (
            <video
              src={img.src}
              controls
              autoPlay
              muted
              loop
              playsInline
              className="object-contain max-h-[72vh] w-auto max-w-full"
            />
          ) : (
            <img
              src={img.src}
              alt={section.title}
              className="object-contain max-h-[72vh] w-auto max-w-full"
            />
          )}

          {/* NEXT */}
          <button
            onClick={() =>
              nextImg
                ? router.push(
                    `/${lang}/works/${id}/${sectionID}/${nextImg.id}`
                  )
                : router.push(
                    `/${lang}/works/${id}/${sectionID}`
                  )
            }
            className={`
              absolute
              right-[-4px]
              top-1/2
              -translate-y-1/2
              text-4xl
              text-neutral-500
              z-20

              ${
                nextImg
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }
            `}
          >
            ›
          </button>
        </div>
      </div>

      <div className="px-6 pb-10 pt-6">
        <h2 className="text-[13px] tracking-[0.08em] uppercase mb-3">
          {section.title}
        </h2>

        {img.description && (
          <p className="text-[12px] leading-[1.9] text-neutral-600">
            {img.description?.[lang] ||
              img.description}
          </p>
        )}
      </div>
    </div>

    {/* DESKTOP */}
    <div className="hidden md:grid w-full max-w-6xl h-full mx-auto px-10 grid-cols-[180px_1fr] gap-10 items-start">
      {/* LEFT */}
      <div
        className="text-sm text-gray-800 flex flex-col pt-2 ml-2"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0)"
            : "translateY(-8px)",

          transition:
            "opacity 700ms ease 150ms, transform 700ms ease 150ms",
        }}
      >
        <Link
          href={`/${lang}/works/${id}/${sectionID}`}
          className="text-xs tracking-widest text-gray-500 hover:text-black"
        >
          ← Back to section
        </Link>

        <div className="mt-5">
          <h2 className="text-base font-semibold mb-1">
            {section.title}
          </h2>

          {img.description && (
            <p className="mb-6 text-sm leading-relaxed text-neutral-600">
              {img.description?.[lang] ||
                img.description}
            </p>
          )}
        </div>
      </div>

      {/* MEDIA */}
      <div
        className="relative w-full flex justify-center pb-16"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0)"
            : "translateY(-10px)",

          transition:
            "opacity 800ms ease 80ms, transform 800ms ease 80ms",
        }}
      >
        {/* PREV */}
        <button
          onClick={() =>
            prevImg &&
            router.push(
              `/${lang}/works/${id}/${sectionID}/${prevImg.id}`
            )
          }
          className={`absolute left-[-52px] top-1/2 -translate-y-1/2 text-5xl text-gray-600 hover:text-black ${
            prevImg
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          ‹
        </button>

        {/* MEDIA */}
        {img.type === "video" ? (
          <video
            src={img.src}
            controls
            autoPlay
            muted
            loop
            playsInline
            className="object-contain max-h-[78vh] w-auto max-w-full"
          />
        ) : (
          <img
            src={img.src}
            alt={section.title}
            className="object-contain max-h-[78vh] w-auto max-w-full"
          />
        )}

        {/* NEXT */}
        <button
          onClick={() =>
            nextImg
              ? router.push(
                  `/${lang}/works/${id}/${sectionID}/${nextImg.id}`
                )
              : router.push(
                  `/${lang}/works/${id}/${sectionID}`
                )
          }
          className={`absolute right-[-52px] top-1/2 -translate-y-1/2 text-5xl text-gray-600 hover:text-black ${
            nextImg
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          ›
        </button>
        </div>
      </div>
    </div>
  );
}