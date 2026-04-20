"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { pages } from "@/data/pages";

const navItems = [
  { href: "/bio", key: "bio" },
  { href: "/works", key: "works" },
  { href: "/press", key: "press" },
  { href: "/cv", key: "cv" },
  { href: "/contact", key: "contact" },
];

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function withLang(href, lang) {
  return `${href}?lang=${lang}`;
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
        <Link
          href={withLang("/home", lang)}
          className="block text-base tracking-wide text-black hover:opacity-70 transition-opacity"
        >
          Ingrid Pumayalla
        </Link>

        <div className="mt-1 text-xs text-neutral-500">
          {lang === "es"
            ? "Artista visual · Archivo"
            : "Visual artist · Archive"}
        </div>

        <div className="mt-2 text-[11px] text-neutral-400 hover:text-neutral-700">
          <button onClick={toggleLang}>
            {lang === "es" ? "EN" : "ES"}
          </button>
        </div>

        {/* INDEX toggle */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setIndexOpen((v) => !v)}
            aria-expanded={indexOpen}
            aria-controls="mobile-index"
            className="group inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <span>{lang === "es" ? "Índice" : "Index"}</span>
            <span
              className={`leading-none transition-transform duration-200 ${
                indexOpen ? "rotate-90" : ""
              }`}
            >
              →
            </span>
          </button>

          <div className="mt-3 h-px w-full bg-neutral-200/60" />

          <div
            id="mobile-index"
            className={`overflow-hidden transition-all duration-300 ${
              indexOpen ? "max-h-28 opacity-100" : "max-h-0 opacity-0"
            }`}
            onPointerDown={() => {
              if (indexOpen) scheduleAutoClose();
            }}
          >
            <nav className="pt-4 pb-2">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {navItems.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={withLang(item.href, lang)}
                        className={`text-sm tracking-wide ${
                          active
                            ? "text-black"
                            : "text-neutral-400 hover:text-neutral-700"
                        }`}
                        onClick={() => {
                          clearCloseTimer();
                          setIndexOpen(false);
                        }}
                      >
                        {active && (
                          <span className="mr-2 text-neutral-300">—</span>
                        )}
                        {pages[item.key].title[lang]}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 h-px w-full bg-neutral-200/60" />
            </nav>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex flex-col w-[220px] shrink-0">
        <div className="sticky top-0 h-screen">
          <nav>
            <ul className="flex flex-col gap-4">
              <li className="mt-16 mb-14">
                <Link
                  href={withLang("/home", lang)}
                  className="text-xl md:text-[22px] tracking-wide text-black hover:opacity-70"
                >
                  Ingrid Pumayalla
                </Link>

                <div className="mt-2 text-xs text-neutral-500">
                  {lang === "es"
                    ? "Artista visual · Archivo"
                    : "Visual artist · Archive"}
                </div>

                <div className="mt-2 text-[11px] text-neutral-400 hover:text-neutral-700">
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
                      className={`text-[13px] tracking-[0.02em] ${
                        active
                          ? "text-black"
                          : "text-neutral-400 hover:text-neutral-700"
                      }`}
                    >
                      <span
                        className={
                          active ? "inline-flex items-center gap-2" : ""
                        }
                      >
                        {active && (
                          <span className="text-neutral-300">—</span>
                        )}
                        {pages[item.key].title[lang]}
                      </span>
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