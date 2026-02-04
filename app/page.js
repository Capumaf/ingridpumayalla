"use client";

import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <Link
      href="/home"
      className="fixed inset-0 overflow-hidden cursor-pointer block"
      aria-label="Entrar al sitio"
    >
      <Image
        src="/caratula.jpg"
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
        Click para entrar
      </span>
    </Link>
  );
}
