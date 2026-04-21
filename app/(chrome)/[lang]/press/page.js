import { pages } from "@/data/pages";

export default function Press({ params }) {
  const lang = params.lang;
  const { title, text } = pages.press;

  return (
    <div>
      <h1 className="text-2xl font-normal tracking-[0.15em] mb-12 mt-16">
        {title[lang]}
      </h1>
      <p className="text-xs text-neutral-600">
        {text[lang]}
      </p>
    </div>
  );
}