import { projectDetails } from "@/data/projectDetails";
import {
  getLocalizedText,
  stripHtml,
  truncate,
  buildAlternates,
  DEFAULT_OG_IMAGE,
} from "@/lib/metadata";

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  const project = projectDetails[id];

  if (!project) return {};

  const title = getLocalizedText(project.title, lang);
  const description = truncate(
    stripHtml(getLocalizedText(project.text, lang)),
    160
  );
  const image = project.imageData?.[0]?.src || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: buildAlternates(lang, `/works/${id}`),
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

export default function WorkDetailLayout({ children }) {
  return children;
}
