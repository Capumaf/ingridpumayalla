import { buildAlternates } from "@/lib/metadata";

export async function generateMetadata({ params }) {
  const { lang } = await params;

  return {
    title: lang === "es" ? "Residencias" : "Residencies",
    alternates: buildAlternates(lang, "/residencies"),
  };
}

export default function ResidenciesLayout({ children }) {
  return children;
}
