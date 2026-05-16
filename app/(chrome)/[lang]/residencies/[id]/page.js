"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

import { residencyDetails } from "@/data/residencyDetails";
import ResidencyCover from "@/components/ResidencyCover";

export default function ResidencyDetailPage() {
  const { id } = useParams();
  const pathname = usePathname();

  const lang = pathname.startsWith("/es") ? "es" : "en";
  const residency = residencyDetails[id];

  if (!residency) {
    return (
      <div className="px-6 pt-20">
        <p className="text-sm text-neutral-500">Residency not found</p>
      </div>
    );
  }

  const cover = residency.imageData?.[0];

  console.log("RESIDENCY COVER:", cover);

  const title =
    typeof residency.title === "string"
      ? residency.title
      : residency.title?.[lang];

  const text =
    typeof residency.introduction === "string"
      ? residency.introduction
      : residency.introduction?.[lang] || residency.introduction?.en || "";

  return (
    <div className="w-full flex justify-center px-6 pt-10 pb-24 overflow-hidden">
      <div className="w-full max-w-5xl md:pl-[120px] lg:pl-[160px]">
        {/* Botón de regreso */}
        <div className="mb-6">
          <Link
            href={`/${lang}/residencies`}
            className="text-xs tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            ← {lang === "es" ? "Volver a residencias" : "Back to residencies"}
          </Link>
        </div>

        <ResidencyCover id={id} lang={lang} cover={cover} title={title} />

        <div className="max-w-[520px] mx-auto mt-8 md:mt-32 px-2">
          <h1 className="text-[28px] leading-tight tracking-[0.04em] mb-12 md:mb-24 text-center">
            {title}
          </h1>

          {text && (
            <div
              className="body-text max-w-[520px]"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
        </div>
      </div>
    </div>
  );
}