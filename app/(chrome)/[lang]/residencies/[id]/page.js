import Link from "next/link";
import { notFound } from "next/navigation";
import { residencyDetails } from "@/data/residencyDetails";

export default async function ResidencyDetailPage({ params }) {
  const { id, lang } = await params;

  const residency = residencyDetails[id];

  if (!residency) {
    notFound();
  }

  return (
    <article className="w-full flex justify-center">
      <div className="w-full max-w-3xl px-6 pt-16 pb-24">

        {/* BACK */}
        <div className="mb-12">
          <Link
            href={`/${lang}/residencies`}
            className="text-[11px] tracking-[0.14em] text-neutral-400 hover:text-black transition-colors"
          >
            ← Back to Residencies
          </Link>
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-normal tracking-[0.12em] mb-12">
          {residency.title}
        </h1>

        {/* INTRO */}
        {residency.introduction && (
          <p className="text-sm text-neutral-500 mb-12 leading-relaxed">
            {residency.introduction}
          </p>
        )}

        {/* IMAGES */}
        <div className="space-y-12">
          {residency.imageData?.map((image) => (
            <figure key={image.id}>
              <img
                src={image.src}
                alt=""
                className="w-full h-auto object-cover"
              />

              {image.caption && (
                <figcaption className="mt-3 text-[11px] text-neutral-400">
                  {image.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>

      </div>
    </article>
  );
}