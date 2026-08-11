"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

import { residencyDetails } from "@/data/residencyDetails";

export default function ResidencyPoemPage() {
  const { id, poemId } = useParams();
  const pathname = usePathname();

  const lang = pathname.startsWith("/es") ? "es" : "en";

  const residency = residencyDetails[id];
  const poem = residency?.poems?.find((p) => p.id === poemId);

  const getLocalizedText = (value) => {
    if (typeof value === "string") return value;
    return value?.[lang] || value?.es || value?.en || "";
  };

  if (!residency || !poem) {
    return (
      <div className="px-6 pt-20">
        <p className="text-sm text-neutral-500">
          {lang === "es" ? "Poema no encontrado" : "Poem not found"}
        </p>
      </div>
    );
  }

  const residencyTitle = getLocalizedText(residency.title);
  const poemTitle = getLocalizedText(poem.title);
  const poemText = getLocalizedText(poem.text);

  return (
    <div className="w-full flex justify-center px-6 pt-10 pb-24">
      <div className="w-full max-w-[620px]">

        <div className="mb-8">
          <Link
            href={`/${lang}/residencies/${id}`}
            className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b] transition-colors"
          >
            ← {residencyTitle}
          </Link>
        </div>

        <div className="mb-10 text-center">
          <h1 className="text-[22px] leading-tight tracking-[0.04em]">
            {poemTitle}
          </h1>
        </div>

        {poemText && (
          <div
            className="
              body-text
              text-[13.5px]
              leading-[2]
              text-justify
            "
            dangerouslySetInnerHTML={{
              __html: poemText,
            }}
          />
        )}

      </div>
    </div>
  );
}
