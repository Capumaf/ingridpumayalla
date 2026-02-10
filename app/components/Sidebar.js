"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { href: "/bio", label: "Bio" },
  { href: "/works", label: "Works" },
  { href: "/press", label: "Press" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Sidebar() {
  const pathname = usePathname();
  const [indexOpen, setIndexOpen] = useState(false);

  // ===== Auto-hide config =====
  const AUTO_CLOSE_MS = 4000; // <-- 4 segundos
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

  // Si el usuario navega, cierra el índice
  useEffect(() => {
    setIndexOpen(false);
    clearCloseTimer();
  }, [pathname]);

  // Cuando abre el índice, programa autocierre
  useEffect(() => {
    if (indexOpen) scheduleAutoClose();
    else clearCloseTimer();

    return () => clearCloseTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexOpen]);

  return (
    <>
      {/* ================= MOBILE ================= */}
      <div className="md:hidden px-5 pt-6">
        <Link
          href="/home"
          className="block text-base tracking-wide text-black hover:opacity-70 transition-opacity"
        >
          Ingrid Pumayalla
        </Link>

        <div className="mt-1 text-xs text-neutral-500">
          Visual artist · Archive
        </div>

        {/* INDEX toggle */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setIndexOpen((v) => !v)}
            aria-expanded={indexOpen}
            aria-controls="mobile-index"
            className={[
              "group inline-flex items-center gap-2", // <-- flecha pegada a Index
              "text-xs tracking-[0.16em] uppercase",
              "text-neutral-500 hover:text-black transition-colors",
              "focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-300",
              "focus-visible:ring-offset-2 focus-visible:ring-offset-white",
            ].join(" ")}
          >
            <span>Index</span>
            <span
              aria-hidden="true"
              className={[
                "leading-none text-neutral-400 transition-transform duration-200",
                indexOpen ? "rotate-90" : "rotate-0",
              ].join(" ")}
            >
              →
            </span>
          </button>

          {/* Micro separador */}
          <div className="mt-3 h-px w-full bg-neutral-200/60" />

          {/* Panel horizontal */}
          <div
            id="mobile-index"
            className={[
              "overflow-hidden transition-[max-height,opacity] duration-300 ease-out",
              indexOpen ? "max-h-28 opacity-100" : "max-h-0 opacity-0",
            ].join(" ")}
            // si el usuario toca el panel, reinicia el timer (opcional pero recomendado)
            onPointerDown={() => {
              if (indexOpen) scheduleAutoClose();
            }}
          >
            <nav aria-label="Primary" className="pt-4 pb-2">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {navItems.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={[
                          "text-sm tracking-wide transition-colors",
                          active
                            ? "text-black"
                            : "text-neutral-500 hover:text-black",
                        ].join(" ")}
                        onClick={() => {
                          clearCloseTimer();
                          setIndexOpen(false);
                        }}
                      >
                        {active ? (
                          <span className="mr-2 text-neutral-400">—</span>
                        ) : null}
                        {item.label}
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

      {/* ================= DESKTOP (intacto) ================= */}
      <nav aria-label="Primary" className="hidden md:block">
        <ul className="flex flex-col gap-5">
          <li className="mt-14 mb-12">
            <Link
              href="/home"
              className="text-lg md:text-2xl tracking-wide text-black transition-opacity hover:opacity-70"
            >
              Ingrid Pumayalla
            </Link>

            <div className="mt-2 text-xs text-neutral-500">
              Visual artist · Archive
            </div>
          </li>

          {navItems.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "text-sm tracking-wide transition-colors",
                    active ? "text-black" : "text-neutral-500 hover:text-black",
                  ].join(" ")}
                >
                  <span className={active ? "inline-flex items-center gap-2" : ""}>
                    {active ? <span className="text-neutral-400">—</span> : null}
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
