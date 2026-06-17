"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { href: "/bio", label: { en: "Biography", es: "Biografía" } },
  { href: "/works", label: { en: "Works", es: "Obras" } },
  { href: "/press", label: { en: "Press & Publications", es: "Prensa & Publicaciones" } },
  { href: "/residencies", label: { en: "Residencies", es: "Residencias" } },
  { href: "/cv", label: { en: "CV", es: "CV" } },
  { href: "/contact", label: { en: "Contact", es: "Contacto" } },
];

function isActive(pathname, href) {
  const cleanPath = pathname.replace(/^\/(en|es)/, "");
  return cleanPath === href || cleanPath.startsWith(href + "/");
}

function withLang(href, lang) {
  return `/${lang}${href}`;
}

export default function Sidebar({ lang = "en", toggleLang }) {
  const pathname = usePathname();
  const [indexOpen, setIndexOpen] = useState(false);

  const AUTO_CLOSE_MS = 4000;
  const closeTimerRef = useRef(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleAutoClose = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setIndexOpen(false);
      closeTimerRef.current = null;
    }, AUTO_CLOSE_MS);
  };

  useEffect(() => {
    setIndexOpen(false);
    clearCloseTimer();
  }, [pathname]);

  useEffect(() => {
    if (indexOpen) scheduleAutoClose();
    else clearCloseTimer();
    return () => clearCloseTimer();
  }, [indexOpen]);

  return (
    <>
      {/* ================= MOBILE ================= */}
      <div className="md:hidden px-5 pt-6">
        <div className="flex items-start justify-between">
          <div>
            <Link
              href={withLang("/home", lang)}
              className="block text-[18px] tracking-wide text-black hover:text-[#b7623b] transition-colors"
            >
              Ingrid Pumayalla
            </Link>

            <div className="mt-1 text-xs text-neutral-500">
              {lang === "es"
                ? "Artista visual · Archivo"
                : "Visual artist · Archive"}
            </div>
          </div>

          <button
            onClick={toggleLang}
            className="text-[11px] text-neutral-400 hover:text-[#b7623b] transition-colors"
          >
            {lang === "es" ? "EN" : "ES"}
          </button>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={() => setIndexOpen((v) => !v)}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-neutral-400 hover:text-[#b7623b] transition-colors"
          >
            <span>{lang === "es" ? "Menú" : "Menu"}</span>
            <span className={`transition-transform ${indexOpen ? "rotate-90" : ""}`}>
              →
            </span>
          </button>

          <div className="mt-3 h-px w-full bg-neutral-200/70" />

          <div
            className={`overflow-hidden transition-all duration-500 ease-out ${
              indexOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <nav className="pt-5 pb-3">
              <ul className="space-y-3">
                {navItems.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={withLang(item.href, lang)}
                        className={`text-[14px] transition-colors ${
                          active
                            ? "text-[#b75d5b]"
                            : "text-neutral-500 hover:text-[#b7623b]"
                        }`}
                        onClick={() => {
                          clearCloseTimer();
                          setIndexOpen(false);
                        }}
                      >
                        {active && <span className="mr-2 text-[#b75d5b]">—</span>}
                        {item.label[lang]}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-5 h-px w-full bg-neutral-200/70" />
            </nav>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex flex-col w-[160px] shrink-0 relative">
        {/* Línea vertical derecha */}
        <div className="absolute right-0 top-0 h-full w-px bg-neutral-200/60" />

        <div className="sticky top-0 h-screen pr-6">
          <nav>
            <ul className="flex flex-col gap-4">
              <li className="mt-16 mb-14">
                <Link
                  href={withLang("/home", lang)}
                  className="text-[17px] text-black hover:opacity-70 leading-snug"
                >
                  Ingrid Pumayalla
                </Link>

                <div className="mt-2 text-xs text-neutral-500">
                  {lang === "es"
                    ? "Artista visual · Archivo"
                    : "Visual artist · Archive"}
                </div>

                <div className="mt-2 text-[11px] text-neutral-400 hover:text-[#b7623b] transition-colors">
                  <button onClick={toggleLang}>
                    {lang === "es" ? "EN" : "ES"}
                  </button>
                </div>
              </li>

              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={withLang(item.href, lang)}
                      className={`text-[12px] transition-colors ${
                        active
                          ? "text-[#b75d5b]"
                          : "text-neutral-400 hover:text-[#b7623b]"
                      }`}
                    >
                      {active && <span className="mr-2 text-[#b75d5b]">—</span>}
                      {item.label[lang]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}