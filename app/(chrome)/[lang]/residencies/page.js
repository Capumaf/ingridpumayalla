"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const residencies = [
  {
    id: "amorgos",
    title: "Amorgos",
  },
  {
    id: "bledfa-center",
    title: "Bledfa Center",
  },
  {
    id: "chain-in-reaction",
    title: "Chain in Reaction",
  },
  {
    id: "solace-project",
    title: "Solace Project",
  },
  {
    id: "pa-utrygg-grun",
    title: "Pa Utrygg grun",
  },
];

export default function ResidenciesPage() {
  const pathname = usePathname();

  const lang = pathname.startsWith("/es")
    ? "es"
    : "en";

  return (
    <div className="w-full flex justify-center px-6 pt-10 pb-24 overflow-hidden">
      <div className="w-full max-w-5xl md:pl-[80px] lg:pl-[120px]">

        <div className="max-w-[720px] mt-6 md:mt-20 px-2 md:translate-x-[40px]">

          <h1 className="text-2xl font-normal tracking-[0.15em] mb-12">
            Residencies
          </h1>

          <ul className="space-y-2">
            {residencies.map((residency) => (
              <li key={residency.id}>
                <Link
                  href={`/${lang}/residencies/${residency.id}`}
                  className="text-xs text-neutral-600 hover:text-black transition-colors"
                >
                  {residency.title}
                </Link>
              </li>
            ))}
          </ul>

        </div>

      </div>
    </div>
  );
}