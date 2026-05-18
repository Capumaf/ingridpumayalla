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

  const imageSrc =
    view === "statement"
      ? "/Cromlech-and-gaza.webp"
      : "/SelfportraitWithHugstone.webp";

  const imageAlt =
    view === "statement"
      ? "Cromlech and Gaza"
      : "Selfportrait with Hugstone";

  const caption =
    view === "statement"
      ? "Cromlech and Gaza, 2022."
      : "Selfportrait with Hugstone, 2018.";

  return (
    <article className="pt-14 md:pt-16">
      <div className="px-6 md:px-0 max-w-[820px] mx-auto">
        <figure className="mb-6 flex flex-col items-center">
          <BioCover
            href={toggleHref}
            label={toggleLabel}
            imageSrc={imageSrc}
            imageAlt={imageAlt}
          />

          <figcaption className="mt-4 w-full max-w-[820px] text-center md:text-right md:pr-[42px] text-[11px] tracking-wide text-neutral-400">
            {caption}
          </figcaption>
        </figure>

        <div className="w-full flex justify-center md:translate-x-[75px]">
          <div
            className="
              body-text
              w-full
              max-w-[780px]

              px-0
              md:pl-[100px]
              md:pr-[125px]

              text-[13.5px]
              leading-[2]
            "
            dangerouslySetInnerHTML={{
              __html: content?.text?.[lang] || "",
            }}
          />
        </div>
      </div>
    </article>
  );
}