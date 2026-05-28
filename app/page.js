"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [lang, setLang] = useState("es");

  useEffect(() => {
    const browserLang =
      navigator.language?.startsWith("es")
        ? "es"
        : "en";

    setLang(browserLang);
  }, []);

  return (
    <Link
      href={`/${lang}/home`}
      className="fixed inset-0 overflow-hidden cursor-pointer block"
      aria-label={
        lang === "es"
          ? "Entrar al sitio"
          : "Enter site"
      }
    >
      <Image
        src="/caratula.webp"
        alt="Ingrid Pumayalla"
        fill
        priority
        className="object-cover pointer-events-none"
      />

      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      <h1
        className="
          absolute
          left-8
          md:left-16
          top-28
          md:top-36
          text-white
          text-[40px]
          md:text-[64px]
          leading-[0.95]
          tracking-[-0.03em]
          font-light
          pointer-events-none
        "
      >
        Ingrid
        <br />
        Pumayalla
      </h1>

      <span
        className="
          absolute
          bottom-8
          left-8
          md:left-16
          text-white/75
          text-sm
          tracking-[0.08em]
          pointer-events-none
        "
      >
        Click
      </span>
    </Link>
  );
}