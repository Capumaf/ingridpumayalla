"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [lang, setLang] = useState("es");

  useEffect(() => {
    const browserLang = navigator.language?.startsWith("es") ? "es" : "en";
    setLang(browserLang);
  }, []);

  return (
    <Link
      href={`/${lang}/home`}
      className="fixed inset-0 overflow-hidden cursor-pointer block"
      aria-label={lang === "es" ? "Entrar al sitio" : "Enter site"}
    >
      <Image
        src="/caratula.webp"
        alt="Ingrid Pumayalla"
        fill
        priority
        className="object-cover pointer-events-none"
      />

      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      <h1 className="absolute left-8 md:left-16 top-24 md:top-32 text-white text-2xl md:text-4xl tracking-wide pointer-events-none">
        Ingrid Pumayalla
      </h1>

      <span className="absolute bottom-6 left-8 text-white/70 text-xs pointer-events-none">
        {lang === "es" ? "Click para entrar" : "Click to enter"}
      </span>
    </Link>
  );
}