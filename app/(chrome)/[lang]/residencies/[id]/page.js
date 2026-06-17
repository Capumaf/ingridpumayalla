"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import Head from "next/head";

import { residencyDetails } from "@/data/residencyDetails";
import ResidencyCover from "@/components/ResidencyCover";

export default function ResidencyDetailPage() {
  const { id } = useParams();

  const pathname = usePathname();

  const lang = pathname.startsWith("/es")
    ? "es"
    : "en";

  const residency = residencyDetails[id];

  if (!residency) {
    return (
      <div className="px-6 pt-20">
        <p className="text-sm text-neutral-500">
          Residency not found
        </p>
      </div>
    );
  }

  const cover = residency.imageData?.[0];

  const title =
    typeof residency.title === "string"
      ? residency.title
      : residency.title?.[lang];

  const subtitle =
    typeof residency.subtitle === "string"
      ? residency.subtitle
      : residency.subtitle?.[lang] ||
        residency.subtitle?.en ||
        "";

  const text =
    typeof residency.text === "string"
      ? residency.text
      : residency.text?.[lang] ||
        residency.text?.en ||
        residency.introduction ||
        "";

  const coverSrc = cover?.src || null;

  return (
    <>
      {coverSrc && (
        <Head>
          <link rel="preload" as="image" href={coverSrc} />
        </Head>
      )}

      <div className="w-full flex justify-center px-6 pt-10 pb-24 overflow-hidden">
        <div className="w-full max-w-5xl md:pl-[120px] lg:pl-[160px]">

          {/* BACK */}
          <div className="mb-6">
            <Link
              href={`/${lang}/residencies`}
              className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b] transition-colors"
            >
              ←{" "}
              {lang === "es"
                ? "Volver a residencias"
                : "Back to residencies"}
            </Link>
          </div>

          {/* COVER */}
          <ResidencyCover
            id={id}
            lang={lang}
            cover={cover}
            title={title}
          />

          {/* CONTENT */}
          <div className="max-w-[620px] mx-auto mt-16 md:mt-28 px-2">

            {/* TITLE */}
            <div className="mb-8 md:mb-12 text-center">
              <h1 className="text-[28px] leading-tight tracking-[0.04em]">
                {title}
              </h1>

              {subtitle && (
                <p className="mt-3 text-[13px] tracking-[0.08em] text-neutral-500 italic">
                  {subtitle}
                </p>
              )}
            </div>

            {/* TEXT */}
            {text && (
              <div
                className="
                  body-text
                  max-w-[620px]
                  text-[13.5px]
                  leading-[2]
                  text-justify
                "
                dangerouslySetInnerHTML={{
                  __html: text,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}