"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import { residencyDetails } from "@/data/residencyDetails";

const residencies = [
  {
    id: "amorgos",
    title: "Amorgos",
  },
  {
    id: "bledfa-center",
    title: "Bledfa Center",
  },
  {
    id: "chain-in-reaction",
    title: "Chain in Reaction",
  },
  {
    id: "solace-project",
    title: "Solace Project",
  },
  {
    id: "pa-utrygg-grun",
    title: "Pa Utrygg grun",
  },
  {
    id: "songs-from-the-mountain-to-the-sea",
    title: "Orality Workshop: Songs from the Mountain to the Sea",
  },
];

export default function ResidenciesPage() {
  const pathname = usePathname();

  const lang = pathname.startsWith("/es")
    ? "es"
    : "en";

  const [openId, setOpenId] = useState(null);

  const getLocalizedText = (value) => {
    if (typeof value === "string") return value;
    return value?.[lang] || value?.es || value?.en || "";
  };

  return (
    <div className="w-full flex justify-center px-6 pt-10 pb-24 overflow-hidden">
      <div className="w-full max-w-5xl md:pl-[80px] lg:pl-[120px]">

        <div className="max-w-[720px] mt-6 md:mt-20 px-2 md:translate-x-[40px]">

          <h1 className="text-2xl font-normal tracking-[0.15em] mb-12">
            Residencies
          </h1>

          <ul className="space-y-2">
            {residencies.map((residency) => {
              const detail = residencyDetails[residency.id];
              const poems = detail?.poems || [];
              const hasDropdown = poems.length > 0;
              const isOpen = hasDropdown && openId === residency.id;

              return (
                <li
                  key={residency.id}
                  onMouseEnter={() => {
                    if (hasDropdown) setOpenId(residency.id);
                  }}
                  onMouseLeave={() => {
                    if (hasDropdown) setOpenId(null);
                  }}
                >
                  <Link
                    href={`/${lang}/residencies/${residency.id}`}
                    className="text-xs text-neutral-600 hover:text-[#b7623b] transition-colors"
                  >
                    {residency.title}
                  </Link>

                  {hasDropdown && (
                    <div
                      className={`
                        overflow-hidden
                        transition-all
                        duration-500
                        ease-out
                        ${
                          isOpen
                            ? "max-h-60 opacity-100 mt-2"
                            : "max-h-0 opacity-0 mt-0"
                        }
                      `}
                    >
                      <ul className="ml-4 space-y-1">
                        {poems.map((poem) => (
                          <li key={poem.id}>
                            <Link
                              href={`/${lang}/residencies/${residency.id}/poems/${poem.id}`}
                              className="text-[11px] text-neutral-400 hover:text-[#b7623b] transition-colors"
                            >
                              {getLocalizedText(poem.title)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

        </div>

      </div>
    </div>
  );
}
