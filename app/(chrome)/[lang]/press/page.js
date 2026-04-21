import { pages } from "@/data/pages";

export default function Press({ params }) {
  const lang = params.lang;

  const { title, text } = pages.press;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        {title[lang]}
      </h1>

      <p className="mt-4">
        {text[lang]}
      </p>
    </div>
  );
}