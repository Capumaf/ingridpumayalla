import { pages } from "@/data/pages";

export default function CV() {
  const { title, downloadLabel, downloadHref } = pages.cv;

  return (
    <div className="mt-40">
      <h1 className="text-2xl mb-10">{title.en}</h1>

      <a
        href={downloadHref}
        download
        className="text-black tracking-wide transition-opacity hover:opacity-70"
      >
        {downloadLabel.en}
      </a>
    </div>
  );
}