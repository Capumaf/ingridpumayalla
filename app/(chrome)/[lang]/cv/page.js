import { pages } from "@/data/pages";

export default function CV({ params }) {
  const lang = params.lang;
  const { title, downloadLabel, downloadHref } = pages.cv;

  return (
    <div className="mt-16">
      <h1 className="text-2xl font-normal tracking-[0.15em] mb-12">
        {title[lang]}
      </h1>

      <a
        href={downloadHref}
        download
        className="text-xs text-neutral-600 tracking-wide transition-opacity hover:opacity-70"
      >
        {downloadLabel[lang]}
      </a>
    </div>
  );
}