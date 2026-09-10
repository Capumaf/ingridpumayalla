import Link from "next/link";

export default function Footer({ lang = "en" }) {
  const t = {
    en: { privacy: "Privacy", terms: "Terms" },
    es: { privacy: "Privacidad", terms: "Términos" },
  }[lang] || { privacy: "Privacy", terms: "Terms" };

  const legalLinks = (
    <span className="inline-flex items-center gap-3">
      <Link
        href={`/${lang}/privacy`}
        className="hover:text-neutral-700 transition-colors"
      >
        {t.privacy}
      </Link>
      <span aria-hidden="true">·</span>
      <Link
        href={`/${lang}/terms`}
        className="hover:text-neutral-700 transition-colors"
      >
        {t.terms}
      </Link>
    </span>
  );

  return (
    <footer className="w-full py-8">
      {/* MOBILE */}
      <div className="md:hidden flex flex-col items-center gap-2">
        <p className="text-[11px] text-neutral-400 tracking-wide">
          Ingridpumayalla.com · © 2026 · Site by NinanStudio
        </p>
        <p className="text-[11px] text-neutral-400 tracking-wide">
          {legalLinks}
        </p>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex md:flex-col md:items-center md:gap-2 md:pl-[100px] lg:pl-[120px]">
        <p className="text-center text-[11px] text-neutral-400 tracking-wide">
          Ingridpumayalla.com · © 2026 · Site by NinanStudio
        </p>
        <p className="text-center text-[11px] text-neutral-400 tracking-wide">
          {legalLinks}
        </p>
      </div>
    </footer>
  );
}