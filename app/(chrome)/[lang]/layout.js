import { DEFAULT_OG_IMAGE } from "@/lib/metadata";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isEs = lang === "es";

  return {
    title: {
      template: "%s — Ingrid Pumayalla",
      default: isEs
        ? "Ingrid Pumayalla — Artista visual"
        : "Ingrid Pumayalla — Visual Artist",
    },
    description: isEs
      ? "Portafolio de Ingrid Pumayalla, artista visual peruana radicada en Londres. Instalación, performance, imagen en movimiento, fotografía y textiles."
      : "Portfolio of Ingrid Pumayalla, a Peruvian visual artist based in London. Installation, performance, moving image, photography and textiles.",
    openGraph: {
      type: "website",
      siteName: "Ingrid Pumayalla",
      locale: isEs ? "es_ES" : "en_GB",
      images: [{ url: DEFAULT_OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default function LangLayout({ children }) {
  return children;
}
