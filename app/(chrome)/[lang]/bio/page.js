import { pages } from "../../../data/pages";
import BioCover from "@/components/BioCover";

export default async function Bio({ params, searchParams }) {
  const { lang } = await params;
  const sp = await searchParams;

  const view = sp?.view === "statement" ? "statement" : "bio";

  const content =
    view === "statement" && pages.statement
      ? pages.statement
      : pages.bio;

  const toggleHref =
    view === "statement"
      ? `/${lang}/bio`
      : `/${lang}/bio?view=statement`;

  const toggleLabel =
    view === "statement"
      ? lang === "es"
        ? "Ver biografía"
        : "View Bio"
      : lang === "es"
      ? "Ver statement"
      : "View Statement";

  return (
    <article className="pt-14 md:pt-16">
      <div className="px-6 md:px-0 max-w-[760px] mx-auto">
        <figure className="mb-24 flex flex-col items-center">
          <BioCover
            href={toggleHref}
            label={toggleLabel}
            imageSrc="/SelfportraitWithHugstone.webp"
            imageAlt="Selfportrait with Hugstone"
          />

          <figcaption className="mt-4 w-full max-w-[640px] text-right text-[11px] tracking-wide text-neutral-400">
            Selfportrait with Hugstone, 2018.
          </figcaption>
        </figure>

        <div className="flex justify-center">
          <div
            className="body-text max-w-[520px] text-[13.5px] leading-[2]"
            dangerouslySetInnerHTML={{
              __html: content?.text?.[lang] || "",
            }}
          />
        </div>
      </div>
    </article>
  );
}