"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

import { projectDetails } from "../../../../data/projectDetails";

export default function WorkDetailPage() {
  const { id } = useParams();
  const pathname = usePathname();

  const lang = pathname.startsWith("/es") ? "es" : "en";

  const project = projectDetails[id];

  if (!project) {
    return <div>Project not found</div>;
  }

  const title =
    typeof project.title === "string"
      ? project.title
      : project.title?.[lang];

  return (
    <div className="w-full flex justify-center mt-32">
      <div className="w-full max-w-2xl px-6">

        <Link
          href={`/${lang}/works`}
          className="text-sm text-neutral-400 hover:text-black mb-6 block"
        >
          ← {lang === "es" ? "Volver" : "Back"}
        </Link>

        <h1 className="text-2xl mb-10">{title}</h1>

        {project.description && (
          <p className="text-neutral-500 mb-10">
            {typeof project.description === "string"
              ? project.description
              : project.description?.[lang]}
          </p>
        )}

        {/* ejemplo imágenes */}
        {project.imageData?.map((img) => (
          <div key={img.id} className="mb-6">
            <img src={img.src} alt="" className="w-full object-contain" />
          </div>
        ))}

      </div>
    </div>
  );
}