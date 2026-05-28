import { pages } from "../../../data/pages";

export default async function Press({ params }) {
  const { lang } = await params;

  const { title, text, items = [] } = pages.press;

  return (
    <div className="mt-16 max-w-xl md:ml-[120px]">
      <h1 className="mb-12 text-2xl font-normal tracking-[0.15em]">
        {title[lang]}
      </h1>

      {text?.[lang] && (
        <p className="mb-10 text-xs text-neutral-600">
          {text[lang]}
        </p>
      )}

      {items.length > 0 && (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.link}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs tracking-[0.04em] text-neutral-600 hover:text-[#c472b6] transition-colors"
              >
                {item.year && (
                  <span className="mr-2 text-neutral-400">
                    {item.year}
                  </span>
                )}
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}