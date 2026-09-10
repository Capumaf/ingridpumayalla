import { WORK_ORDER } from "@/data/worksOrder";
import { residencyDetails } from "@/data/residencyDetails";

export default function sitemap() {
  const base = "https://ingridpumayalla.com";
  const langs = ["es", "en"];

  const staticPaths = ["/home", "/works", "/bio", "/press", "/cv", "/contact", "/residencies", "/privacy", "/terms"];

  const staticEntries = [
    { url: base, lastModified: new Date() },
    ...langs.flatMap((lang) =>
      staticPaths.map((path) => ({
        url: `${base}/${lang}${path}`,
        lastModified: new Date(),
      }))
    ),
  ];

  const workEntries = langs.flatMap((lang) =>
    WORK_ORDER.map((id) => ({
      url: `${base}/${lang}/works/${id}`,
      lastModified: new Date(),
    }))
  );

  const residencyEntries = langs.flatMap((lang) =>
    Object.keys(residencyDetails).map((id) => ({
      url: `${base}/${lang}/residencies/${id}`,
      lastModified: new Date(),
    }))
  );

  return [...staticEntries, ...workEntries, ...residencyEntries];
}
