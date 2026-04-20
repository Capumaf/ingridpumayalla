"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { pages } from "../../data/pages";

function BioContent() {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "en";

  const bio = pages.bio;

  return (
    <article className="mt-32">
      <div className="px-6 md:pl-40 md:pr-0">

        {/* TITLE */}
        <h1 className="text-[20px] md:text-[22px] tracking-wide text-black mb-12">
          {bio.title[lang]}
        </h1>

        {/* BIO TEXT */}
        <div
          className="body-text"
          dangerouslySetInnerHTML={{ __html: bio.text[lang] }}
        />

        {/* IMAGE */}
        <figure className="mt-16 mb-20">
          <div className="w-full max-w-[460px]">
            <Image
              src="/SelfportraitWithHugstone.webp"
              alt=""
              width={720}
              height={480}
              className="w-full h-auto object-contain"
            />
          </div>

          <figcaption className="mt-3 text-[11px] text-neutral-400">
            Selfportrait with Hugstone, 2018.
          </figcaption>
        </figure>

        {/* STATEMENT TITLE */}
        <h2 className="text-[20px] md:text-[22px] tracking-wide text-black mb-12">
          {bio.statementTitle[lang]}
        </h2>

        {/* STATEMENT TEXT */}
        <div
          className="body-text"
          dangerouslySetInnerHTML={{ __html: bio.statement[lang] }}
        />

      </div>
    </article>
  );
}

export default function Bio() {
  return (
    <Suspense fallback={null}>
      <BioContent />
    </Suspense>
  );
}