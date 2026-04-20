import { pages } from "@/data/pages";

export default function Press() {
  const { title, text } = pages.press;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">{title.en}</h1>
      <p className="mt-4">{text.en}</p>
    </div>
  );
}