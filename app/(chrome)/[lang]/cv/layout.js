import { pages } from "@/data/pages";
import { getLocalizedText, buildAlternates } from "@/lib/metadata";

export async function generateMetadata({ params }) {
  const { lang } = await params;

  return {
    title: getLocalizedText(pages.cv.title, lang),
    alternates: buildAlternates(lang, "/cv"),
  };
}

export default function CvLayout({ children }) {
  return children;
}
