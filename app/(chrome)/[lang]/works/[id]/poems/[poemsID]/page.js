import Link from "next/link";
import { projectDetails } from "@/data/projectDetails";

export default async function PoemPage({ params }) {
  const { lang, id, poemsID } = await params;

  const project = projectDetails[id];

  const poem = project?.poems?.find(
    (item) => item.id === poemsID
  );

  if (!project || !poem) {
    return (
      <div className="px-6 pt-20">
        <p className="text-sm text-neutral-500">
          {lang === "es"
            ? "Poema no encontrado"
            : "Poem not found"}
        </p>
      </div>
    );
  }

  const title =
    typeof poem.title === "string"
      ? poem.title
      : poem.title?.[lang] ||
        poem.title?.es ||
        "";

  const text =
    typeof poem.text === "string"
      ? poem.text
      : poem.text?.[lang] ||
        poem.text?.es ||
        "";

  return (
    <article className="w-full pt-8 pb-24">

      {/* BACK BUTTON */}
      <div className="px-6 md:ml-[20rem]">
        <Link
          href={`/${lang}/works`}
          className="
            text-[11px]
            tracking-[0.18em]
            text-neutral-500
            hover:text-black
            transition-colors
          "
        >
          ← {lang === "es"
            ? "Volver a obras"
            : "Back to works"}
        </Link>
      </div>

      {/* POEM COLUMN */}
      <div
        className="
          px-6
          pt-12
          max-w-[560px]
          md:ml-[30rem]
        "
      >

        <header className="mb-16">

          <p
            className="
              mb-5
              text-[11px]
              uppercase
              tracking-[0.24em]
              text-neutral-400
            "
          >
            {project.title}
          </p>

          <h1
            className="
              text-[42px]
              leading-none
              tracking-[0.02em]
              font-normal
            "
          >
            {title}
          </h1>

        </header>

        <div
          className="
            body-text
            text-[15px]
            leading-[2.15]
            text-left
          "
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        />

      </div>

    </article>
  );
}