import Image from "next/image";
import { pages } from "../../../data/pages";

export default async function Bio({ params }) {
  const { lang } = await params;

  const bio = pages.bio;

  return (
    <article className="pt-14 md:pt-16">
      <div className="px-6 md:px-0 max-w-[760px] mx-auto">
        
        {/* IMAGE */}
        <figure className="mb-24 flex flex-col items-center">
          <div className="w-full max-w-[520px]">
            <Image
              src="/SelfportraitWithHugstone.webp"
              alt="Selfportrait with Hugstone"
              width={720}
              height={480}
              priority
              className="w-full h-auto object-contain"
            />
          </div>

          <figcaption className="mt-4 w-full max-w-[520px] text-right text-[11px] tracking-wide text-neutral-400">
            Selfportrait with Hugstone, 2018.
          </figcaption>
        </figure>

        {/* BIO TEXT */}
        <div className="flex justify-center">
          <div
            className="body-text max-w-[520px]"
            dangerouslySetInnerHTML={{ __html: bio.text[lang] }}
          />
        </div>

      </div>
    </article>
  );
}