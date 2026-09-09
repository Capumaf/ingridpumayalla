import { buildAlternates } from "@/lib/metadata";

export async function generateMetadata({ params }) {
  const { lang } = await params;

  return {
    title: lang === "es" ? "Obras" : "Works",
    alternates: buildAlternates(lang, "/works"),
  };
}

export default function WorksLayout({ children }) {
  return children;
}
