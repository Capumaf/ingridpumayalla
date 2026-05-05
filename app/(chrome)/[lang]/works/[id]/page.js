"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { projectDetails } from "../../../../data/projectDetails";

export default function WorkPage() {
  const { id } = useParams();
  const pathname = usePathname();
  const lang = pathname.startsWith("/es") ? "es" : "en";

  const project = projectDetails[id];

  if (!project || !project.imageData?.length) {
    return <div>Project not found</div>;
  }

  const cover = project.imageData[0];
  const description = project.description?.[lang] || "";

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 gap-4">
      <div className="w-full max-w-2xl">
        <Link
          href={`/${lang}/works`}
          className="text-xs text-neutral-400 hover:text-black"
        >
          ← {lang === "es" ? "Volver" : "Back"}
        </Link>
      </div>

      <h1 className="text-2xl font-normal tracking-[0.15em] text-center">
        {project.title?.[lang]}
      </h1>

      <Link href={`/${lang}/works/${id}/${cover.id}`} className="w-full max-w-2xl">
        <img
          src={cover.src}
          alt={project.title?.[lang] || ""}
          className="w-full max-h-[70vh] object-contain"
        />
      </Link>

      {description && (
        <p className="text-xs text-neutral-500 text-center max-w-lg">
          {description}
        </p>
      )}
    </div>
  );
}