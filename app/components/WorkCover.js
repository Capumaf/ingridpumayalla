"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function WorkCover({ id, lang, cover, title }) {
  const router = useRouter();

  const [isHovered, setIsHovered] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [labelTone, setLabelTone] = useState("dark");

  const linkRef = useRef(null);
  const imgRef = useRef(null);
  const perimRef = useRef(null);
  const curveRef = useRef(null);
  const hintTimerRef = useRef(null);

  const perimLen = useRef(0);
  const curveLen = useRef(95);
  const perimBuilt = useRef(false);
  const tl = useRef(null);
  const isMultiTouchRef = useRef(false);

  if (!cover) return null;

  const href = `/${lang}/works/${id}/${cover.id}`;

  const detectLabelTone = () => {
    const img = imgRef.current;
    if (!img || !img.naturalWidth || !img.naturalHeight) return;

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.drawImage(img, 0, 0);

      const sampleX = Math.floor(img.naturalWidth * 0.24);
      const sampleY = Math.floor(img.naturalHeight * 0.92);
      const sampleW = Math.floor(img.naturalWidth * 0.28);
      const sampleH = Math.floor(img.naturalHeight * 0.08);

      const data = ctx.getImageData(sampleX, sampleY, sampleW, sampleH).data;

      let total = 0;
      let count = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        total += 0.299 * r + 0.587 * g + 0.114 * b;
        count++;
      }

      setLabelTone(total / count > 145 ? "light" : "dark");
    } catch {
      setLabelTone("dark");
    }
  };

  const buildPerimeter = () => {
    if (!linkRef.current || !perimRef.current || !curveRef.current) return;

    const rect = linkRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const W = rect.width;
    const H = rect.height;
    const pad = 20;

    const cLen = curveRef.current.getTotalLength();
    curveLen.current = cLen;

    gsap.set(curveRef.current, {
      strokeDasharray: cLen,
      strokeDashoffset: cLen,
      opacity: 0,
    });

    const d = `
      M ${pad} ${H - pad}
      L ${pad} ${pad}
      L ${W - pad} ${pad}
      L ${W - pad} ${H - pad}
      L ${pad} ${H - pad}
    `;

    perimRef.current.setAttribute("d", d);

    const pLen = perimRef.current.getTotalLength();
    perimLen.current = pLen;

    perimRef.current.style.strokeDasharray = `0 ${pLen}`;
    perimRef.current.style.strokeDashoffset = "0";
    perimRef.current.style.opacity = "0";

    perimBuilt.current = true;

    // Fade-in suave de la imagen al cargar
    if (imgRef.current) {
      gsap.fromTo(imgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.9, ease: "power2.out" }
      );
    }
  };

  const handleImageReady = () => {
    requestAnimationFrame(() => {
      buildPerimeter();
      detectLabelTone();
    });
  };

  const triggerMobileHint = () => {
    setShowHint(true);

    clearTimeout(hintTimerRef.current);

    hintTimerRef.current = setTimeout(() => {
      setShowHint(false);
    }, 5000);
  };

  useEffect(() => {
    handleImageReady();
    window.addEventListener("resize", buildPerimeter);

    return () => {
      window.removeEventListener("resize", buildPerimeter);
    };
  }, []);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      triggerMobileHint();
    }, 900);

    const handleScroll = () => {
      triggerMobileHint();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(hintTimerRef.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!curveRef.current || isEntering) return;

    gsap.killTweensOf(curveRef.current);

    gsap.to(curveRef.current, {
      strokeDashoffset: isHovered || showHint ? 0 : curveLen.current,
      opacity: isHovered || showHint ? 1 : 0,
      duration: isHovered || showHint ? 1.15 : 0.75,
      ease: isHovered || showHint ? "power2.out" : "power2.in",
    });
  }, [isHovered, isEntering, showHint]);

  useEffect(() => {
    if (!isEntering || !perimBuilt.current) return;
    if (!perimRef.current || !curveRef.current) return;

    const pLen = perimLen.current;
    const el = perimRef.current;

    const snake = pLen * 0.36;
    const travelEnd = pLen * 0.82;

    gsap.killTweensOf(curveRef.current);
    gsap.to(curveRef.current, {
    strokeDashoffset: curveLen.current,
    opacity: 0,
    duration: 0.55,
    ease: "power2.inOut", 
    });

    const proxy = { drawn: 0, tail: 0 };

    el.style.opacity = "1";

    tl.current = gsap.timeline({
      onUpdate: () => {
        el.style.strokeDasharray = `${proxy.drawn} ${pLen - proxy.drawn}`;
        el.style.strokeDashoffset = `-${proxy.tail}`;
      },
      onComplete: () => {
        gsap.to(el, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => router.push(href),
        });
      },
    });

    tl.current
      .to(proxy, { drawn: snake, duration: 0.35, ease: "power2.out" }, "+=0.35")
      .to(proxy, { tail: travelEnd, duration: 2.7, ease: "power1.inOut" })
      .to(proxy, { drawn: 0, duration: 0.45, ease: "power2.in" }, "-=0.45");
  }, [isEntering, href, router]);

  const handleTouchStart = (e) => {
    isMultiTouchRef.current = e.touches.length > 1;
  };

  const handleClick = (e) => {
    if (isMultiTouchRef.current) {
      isMultiTouchRef.current = false;
      e.preventDefault();
      return;
    }
    e.preventDefault();
    if (isEntering) return;

    if (!perimBuilt.current || !perimRef.current || !perimLen.current || perimLen.current === 0) {
   buildPerimeter();
   } 

   if (!perimBuilt.current || !perimLen.current || perimLen.current === 0) {
   router.push(href);
   return;
   }

    setIsEntering(true);
    };

  const isLightArea = labelTone === "light";

  return (
    <div className="flex justify-center">
      <Link
        ref={linkRef}
        href={href}
        onClick={handleClick}
        onMouseEnter={() => !isEntering && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        className="relative inline-block overflow-hidden max-w-[92vw] md:max-w-[640px]"
        aria-label={lang === "es" ? "Ver serie" : "View series"}
      >
        <img
          ref={imgRef}
          src={cover.src}
          alt={title || ""}
          draggable={false}
          onLoad={handleImageReady}
          loading="eager"
          fetchPriority="high"
          style={{ opacity: 0 }}
          className={`
            w-full max-w-[92vw] md:max-w-[640px]
            h-auto max-h-[74vh] md:max-h-[72vh]
            object-contain cursor-pointer
            transition-all duration-700 ease-out
            ${
              isEntering
                ? "brightness-[0.96]"
                : isHovered
                ? "scale-[1.01] brightness-[1.03]"
                : ""
            }
          `}
        />

        <div
          className={`
            absolute inset-0
            transition-opacity duration-700
            pointer-events-none

            ${showHint ? "opacity-100 md:opacity-0" : "opacity-0"}
            ${isHovered || isEntering ? "md:opacity-100" : ""}
          `}
        >
          <div
            className={`
              absolute bottom-5 left-8 md:bottom-7 md:left-10
              flex items-center gap-3
              transition-transform duration-700
              ${isLightArea ? "text-black" : "text-white"}

              ${
                isHovered || isEntering || showHint
                  ? "translate-y-0"
                  : "translate-y-2"
              }
            `}
          >
            <svg
              width="112"
              height="28"
              viewBox="0 0 112 28"
              fill="none"
              className="shrink-0"
              aria-hidden="true"
            >
              <path
                ref={curveRef}
                d="M 3 14 L 4.89 14.67 L 6.79 14.74 L 8.68 14.1 L 10.57 14.11 L 12.46 15.45 L 14.36 16.54 L 16.25 15.77 L 18.14 14.36 L 20.04 14.91 L 21.93 17.2 L 23.82 18.07 L 25.71 16.19 L 27.61 14.54 L 29.5 16.06 L 31.39 18.92 L 33.29 18.96 L 35.18 16.11 L 37.07 14.84 L 38.96 17.43 L 40.86 20.26 L 42.75 19.1 L 44.64 15.72 L 46.54 15.36 L 48.43 18.77 L 50.32 20.91 L 52.21 18.57 L 54.11 15.29 L 56 16.07 L 57.89 19.74 L 59.79 20.74 L 61.68 17.58 L 63.57 15 L 65.46 16.79 L 67.36 20.07 L 69.25 19.82 L 71.14 16.43 L 73.04 14.92 L 74.93 17.26 L 76.82 19.62 L 78.71 18.36 L 80.61 15.4 L 82.5 14.96 L 84.39 17.22 L 86.29 18.42 L 88.18 16.72 L 90.07 14.64 L 91.96 14.92 L 93.86 16.52 L 95.75 16.71 L 97.64 15.21 L 99.54 14.16 L 101.43 14.58 L 103.32 15.18 L 105.21 14.83 L 107.11 14.09 L 109 13.83"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>

            <span
              className={`
                text-[9px] md:text-[10px]
                tracking-[0.2em] md:tracking-[0.24em]
                uppercase
                font-light
                transition-all duration-500
                px-2.5 md:px-3
                py-[5px] md:py-[6px]
                rounded-full
                backdrop-blur-md

                ${
                  isLightArea
                    ? "bg-white/65 text-black border border-black/10 shadow-[0_4px_18px_rgba(255,255,255,0.25)]"
                    : "bg-black/35 text-white border border-white/15 shadow-[0_4px_18px_rgba(0,0,0,0.35)]"
                }
              `}
              style={
                isEntering
                  ? { opacity: 0, transform: "translateX(6px)" }
                  : undefined
              }
            >
              {lang === "es" ? "Ver serie" : "View series"}
            </span>
          </div>
        </div>

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          fill="none"
          aria-hidden="true"
        >
          <path
            ref={perimRef}
            stroke="white"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            style={{ mixBlendMode: "difference" }}
          />
        </svg>
      </Link>
    </div>
  );
}