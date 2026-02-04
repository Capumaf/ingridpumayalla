"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/home", label: "Ingrid Pumayalla", type: "title" },
  { href: "/bio", label: "Bio" },
  { href: "/works", label: "Works" },
  { href: "/press", label: "Press" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary">
      <ul className="flex flex-col gap-5">
        {items.map((item) => {
          const active = pathname === item.href;

          if (item.type === "title") {
            return (
              <li key={item.href} className="mt-14 mb-12">
                <Link
                  href="/home"
                  className="text-2xl tracking-wide text-black transition-opacity hover:opacity-70"
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  text-sm tracking-wide transition-colors
                  ${active ? "text-black" : "text-neutral-500"}
                  hover:text-black
                `}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
