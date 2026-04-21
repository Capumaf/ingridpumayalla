"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { WORK_ORDER } from "../../../data/worksOrder";
import { projectDetails } from "../../../data/projectDetails";

export default function WorksPage() {
  const pathname = usePathname();
  const router = useRouter();

  // ✅ idioma desde la URL (/en /es)
  const lang = pathname.startsWith("/es") ? "es" : "en";

  return (
    <div className="w-full flex justify-center mt-32">
      <div className="w-full max-w-md px-6">

        <h1 className="text-2xl mb-12">
          {lang === "es" ? "Trabajos" : "Works"}
        </h1>

        <ul className="space-y-4">
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
                  className="text-neutral-600 hover:text-black transition-colors"
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