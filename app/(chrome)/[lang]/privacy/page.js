import { pages } from "../../../data/pages";
import {
  getLocalizedText,
  stripHtml,
  truncate,
  buildAlternates,
} from "@/lib/metadata";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const title = getLocalizedText(pages.privacy.title, lang);
  const description = truncate(
    stripHtml(getLocalizedText(pages.privacy.text, lang)),
    160
  );

  return {
    title,
    description,
    alternates: buildAlternates(lang, "/privacy"),
    openGraph: { title, description },
  };
}

export default async function Privacy({ params }) {
  const { lang } = await params;
  const content = pages.privacy;

  return (
    <article className="pt-14 md:pt-16">
      <div className="px-6 md:px-0 max-w-[820px] mx-auto">
        <header className="mb-10">
          <p className="mb-4 text-[11px] uppercase tracking-[0.24em] text-neutral-400">
            {content.title[lang]}
          </p>
        </header>

        <div
          className="body-text max-w-[620px] text-[13.5px] leading-[1.9] text-neutral-600"
          dangerouslySetInnerHTML={{ __html: content.text[lang] || "" }}
        />
      </div>
    </article>
  );
}
