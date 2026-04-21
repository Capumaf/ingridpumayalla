import { pages } from "@/data/pages";

export default function CV({ params }) {
  const lang = params.lang;

  const { title, downloadLabel, downloadHref } = pages.cv;

  return (
    <div className="mt-40">
      <h1 className="text-2xl mb-10">
        {title[lang]}
      </h1>

      <a
        href={downloadHref}
        download
        className="text-black tracking-wide transition-opacity hover:opacity-70"
      >
        {downloadLabel[lang]}
      </a>
    </div>
  );
}