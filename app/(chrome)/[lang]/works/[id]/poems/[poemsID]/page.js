import Link from "next/link";
import { projectDetails } from "@/data/projectDetails";

export default async function PoemPage({ params }) {
  const { lang, id, poemsID } = await params;

  const project = projectDetails[id];
  const poem = project?.poems?.find((item) => item.id === poemsID);

  if (!project || !poem) {
    return (
      <div className="px-6 pt-20">
        <p className="text-sm text-neutral-500">
          {lang === "es" ? "Poema no encontrado" : "Poem not found"}
        </p>
      </div>
    );
  }

  const title =
    typeof poem.title === "string"
      ? poem.title
      : poem.title?.[lang] || poem.title?.es || "";

  const text =
    typeof poem.text === "string"
      ? poem.text
      : poem.text?.[lang] || poem.text?.es || "";

  return (
    <article className="w-full flex justify-center px-6 pt-10 pb-24">
      <div className="w-full max-w-[720px]">
        <Link
          href={`/${lang}/works`}
          className="text-xs tracking-widest text-gray-500 hover:text-black transition-colors"
        >
          ← {lang === "es" ? "Volver a obras" : "Back to works"}
        </Link>

        <header className="mt-20 mb-14">
          <p className="mb-4 text-[11px] uppercase tracking-[0.24em] text-neutral-400">
            {project.title}
          </p>

          <h1 className="text-[28px] leading-tight tracking-[0.04em] font-normal">
            {title}
          </h1>
        </header>

        <div
          className="
            body-text
            text-[13.5px]
            leading-[2]
            text-justify
          "
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        />
      </div>
    </article>
  );
}