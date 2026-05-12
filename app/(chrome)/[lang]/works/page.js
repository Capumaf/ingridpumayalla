"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { projectDetails } from "@/data/projectDetails";
import { WORK_ORDER } from "@/data/worksOrder";

export default function WorksPage() {
  const pathname = usePathname();
  const lang = pathname.startsWith("/es") ? "es" : "en";

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-md px-6">
        <h1 className="text-2xl font-normal tracking-[0.15em] mb-12 mt-16">
          {lang === "es" ? "Trabajos" : "Works"}
        </h1>

        <ul className="space-y-2">
          {WORK_ORDER.map((id) => {
            const project = projectDetails[id];
            if (!project) return null;

            const sections = project.sections || [];

            return (
              <li key={id}>
                <Link
                  href={`/${lang}/works/${id}`}
                  className="text-xs text-neutral-600 hover:text-black transition-colors"
                >
                  {project.title}
                </Link>

                {sections.length > 0 && (
                  <ul className="mt-2 ml-4 space-y-1">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <Link
                          href={`/${lang}/works/${id}/${section.id}`}
                          className="text-[11px] text-neutral-400 hover:text-black transition-colors"
                        >
                          {section.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}