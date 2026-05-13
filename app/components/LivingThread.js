"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function LivingThread({ isHovered = false, isEntering = false, onComplete }) {
  const curveRef  = useRef(null);
  const perimRef  = useRef(null);
  const wrapRef   = useRef(null);
  const curveLen  = useRef(95);
  const perimLen  = useRef(0);
  const tl        = useRef(null);
  const built     = useRef(false);

  // Al montar: medir curva, construir el path del perímetro con dimensiones reales
  useEffect(() => {
    if (!curveRef.current || !wrapRef.current) return;

    // Curva orgánica — estado inicial invisible
    const cLen = curveRef.current.getTotalLength();
    curveLen.current = cLen;
    gsap.set(curveRef.current, {
      strokeDasharray: cLen,
      strokeDashoffset: cLen,
      opacity: 0,
    });

    // Perímetro — construir path con dimensiones reales del contenedor imagen
    // wrapRef apunta al elemento padre (el Link en WorkCover)
    const rect = wrapRef.current.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;
    const pad = 20; // corresponde a inset-5 (5 * 4px = 20px)

    // Path en sentido horario empezando desde bottom-left
    // bottom-left → top-left → top-right → bottom-right → bottom-left
    const x0 = pad;
    const y0 = H - pad;
    const x1 = pad;
    const y1 = pad;
    const x2 = W - pad;
    const y2 = pad;
    const x3 = W - pad;
    const y3 = H - pad;

    const d = `M ${x0} ${y0} L ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x0} ${y0}`;

    if (perimRef.current) {
      perimRef.current.setAttribute("d", d);
      const pLen = perimRef.current.getTotalLength();
      perimLen.current = pLen;
      gsap.set(perimRef.current, {
        strokeDasharray: `0 ${pLen}`,
        strokeDashoffset: 0,
        opacity: 0,
      });
      built.current = true;
    }
  }, []);

  // HOVER — dibuja / borra la curva orgánica
  useEffect(() => {
    if (!curveRef.current || isEntering) return;

    if (isHovered) {
      gsap.killTweensOf(curveRef.current);
      gsap.to(curveRef.current, {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power2.out",
      });
    } else {
      gsap.killTweensOf(curveRef.current);
      gsap.to(curveRef.current, {
        strokeDashoffset: curveLen.current,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [isHovered, isEntering]);

  // ENTERING — hilo recorre el perímetro en sentido horario
  useEffect(() => {
    if (!isEntering || !built.current) return;
    if (!perimRef.current || !curveRef.current) return;

    const pLen = perimLen.current;

    gsap.killTweensOf(curveRef.current);
    gsap.to(curveRef.current, { opacity: 0, duration: 0.15 });

    gsap.set(perimRef.current, {
      strokeDasharray: `0 ${pLen}`,
      strokeDashoffset: 0,
      opacity: 1,
    });

    tl.current = gsap.timeline({
      onComplete: () => { if (onComplete) onComplete(); },
    });

    tl.current
      .to(perimRef.current, {
        // El hilo crece: dash crece de 0 a pLen
        strokeDasharray: `${pLen} 0`,
        duration: 1.5,
        ease: "power1.inOut",
      })
      .to(perimRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      });

  }, [isEntering]);

  return (
    <>
      {/* Curva orgánica junto al label View Series */}
      <svg
        width="96"
        height="22"
        viewBox="0 0 96 22"
        fill="none"
        className="shrink-0"
        aria-hidden="true"
      >
        <path
          ref={curveRef}
          d="M2 14 C14 3, 25 3, 36 12 C47 21, 63 16, 94 6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/*
        SVG del perímetro — posicionado absolute sobre la imagen
        El path se construye con JS usando las dimensiones reales
        inset-0 cubre toda la imagen, el path tiene el padding de inset-5
      */}
      <svg
        ref={wrapRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        fill="none"
        aria-hidden="true"
      >
        <path
          ref={perimRef}
          stroke="white"
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ mixBlendMode: "difference" }}
        />
      </svg>
    </>
  );
}