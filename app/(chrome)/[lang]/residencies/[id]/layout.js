import { residencyDetails } from "@/data/residencyDetails";
import {
  getLocalizedText,
  stripHtml,
  truncate,
  buildAlternates,
  DEFAULT_OG_IMAGE,
} from "@/lib/metadata";

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  const residency = residencyDetails[id];

  if (!residency) return {};

  const title = getLocalizedText(residency.title, lang);
  const description = truncate(
    stripHtml(getLocalizedText(residency.text, lang)),
    160
  );
  const image = residency.imageData?.[0]?.src || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: buildAlternates(lang, `/residencies/${id}`),
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function ResidencyDetailLayout({ children }) {
  return children;
}
