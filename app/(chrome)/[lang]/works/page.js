"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { WORK_ORDER } from "../../../data/worksOrder";
import { projectDetails } from "../../../data/projectDetails";

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

            const title =
              typeof project.title === "string"
                ? project.title
                : project.title?.[lang];

            return (
              <li key={id}>
                <Link
                  href={`/${lang}/works/${id}`}
                  className="text-xs text-neutral-600 hover:text-black transition-colors"
                >
                  {title}
                </Link>
              </li>
            );
          })}
        </ul>

      </div>
    </div>
  );
}