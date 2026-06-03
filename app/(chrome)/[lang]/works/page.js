"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { projectDetails } from "@/data/projectDetails";
import { WORK_ORDER } from "@/data/worksOrder";

export default function WorksPage() {
  const pathname = usePathname();
  const lang = pathname.startsWith("/es") ? "es" : "en";

  const [openId, setOpenId] = useState(null);

  const getLocalizedText = (value) => {
    if (typeof value === "string") return value;
    return value?.[lang] || value?.es || value?.en || "";
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[540px] px-6">
        <h1 className="text-2xl font-normal tracking-[0.15em] mb-12 mt-16">
          {lang === "es" ? "Obras" : "Works"}
        </h1>

        <ul className="space-y-2">
          {WORK_ORDER.map((id) => {
            const project = projectDetails[id];
            if (!project) return null;

            const sections = project.sections || [];
            const poems = project.poems || [];

            const isOfrendas = id === "ofrendas-offerings";
            const isCantosMatrios = id === "cantos-matrios";

            const hasSectionsDropdown = isOfrendas && sections.length > 0;
            const hasPoemsDropdown = isCantosMatrios && poems.length > 0;
            const hasDropdown = hasSectionsDropdown || hasPoemsDropdown;

            const isOpen = hasDropdown && openId === id;

            return (
              <li
                key={id}
                onMouseEnter={() => {
                  if (hasDropdown) setOpenId(id);
                }}
                onMouseLeave={() => {
                  if (hasDropdown) setOpenId(null);
                }}
              >
                <Link
                  href={`/${lang}/works/${id}`}
                  className="text-xs text-neutral-600 hover:text-[#b7623b] transition-colors"
                >
                  {getLocalizedText(project.title)}
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
                      {hasSectionsDropdown &&
                        sections.map((section) => (
                          <li key={section.id}>
                            <Link
                              href={`/${lang}/works/${id}/sections/${section.id}`}
                              className="text-[11px] text-neutral-400 hover:text-[#b7623b] transition-colors"
                            >
                              {getLocalizedText(section.title)}
                            </Link>
                          </li>
                        ))}

                      {hasPoemsDropdown &&
                        poems.map((poem) => (
                          <li key={poem.id}>
                            <Link
                              href={`/${lang}/works/${id}/poems/${poem.id}`}
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
  );
}