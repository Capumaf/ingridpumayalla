"use client";

import { useEffect, useState } from "react";
import { pages } from "@/data/pages";

export default function CV({ params }) {
  const { lang } = params;

  const { title, downloadLabel, downloadHref } = pages.cv;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      <div className="mt-16">
        <h1 className="mb-12 text-2xl font-normal tracking-[0.15em]">
          {title[lang]}
        </h1>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs tracking-wide text-neutral-600 transition-opacity hover:opacity-70"
        >
          {downloadLabel[lang]}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/80 px-8 py-12 backdrop-blur-md">
          
          {/* Download */}
          <a
            href={downloadHref}
            download
            className="absolute left-6 top-6 text-[11px] tracking-[0.25em] text-white/70 transition hover:text-white"
          >
            DOWNLOAD
          </a>

          {/* Close */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-6 top-6 text-lg text-white/70 transition hover:text-white"
            aria-label="Close CV preview"
          >
            ×
          </button>

          {/* CV container (más grande y editorial) */}
          <div className="h-[92vh] w-[90vw] max-w-5xl shadow-2xl">
            <iframe
              src={downloadHref}
              title={title[lang]}
              className="h-full w-full border-0"
            />
          </div>
        </div>
      )}
    </>
  );
}