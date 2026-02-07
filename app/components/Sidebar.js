"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <>
      {/* MOBILE: masthead + menú horizontal */}
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

        <nav aria-label="Primary" className="mt-5">
          <ul className="flex items-center gap-6 overflow-x-auto whitespace-nowrap pb-2 [-webkit-overflow-scrolling:touch]">
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
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* micro separador editorial */}
          <div className="mt-3 h-px w-full bg-neutral-200/60" />
        </nav>
      </div>

      {/* DESKTOP: sidebar vertical editorial */}
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
