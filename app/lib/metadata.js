export const SITE_URL = "https://ingridpumayalla.com";
export const DEFAULT_OG_IMAGE = "/Ofrendas1.webp";

export function getLocalizedText(value, lang) {
  if (typeof value === "string") return value;
  return value?.[lang] || value?.es || value?.en || "";
}

export function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncate(text, max = 160) {
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export function buildAlternates(lang, path) {
  return {
    canonical: `${SITE_URL}/${lang}${path}`,
    languages: {
      es: `${SITE_URL}/es${path}`,
      en: `${SITE_URL}/en${path}`,
    },
  };
}
