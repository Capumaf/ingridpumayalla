"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function ResidencyCover({ id, lang, cover, title }) {
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

  if (!cover) return null;

  const href = `/${lang}/residencies/${id}/${cover.id}`;

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

      const average = total / count;
      setLabelTone(average > 145 ? "light" : "dark");
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

    if (isHovered || showHint) {
      gsap.to(curveRef.current, {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power2.out",
      });
    } else {
      gsap.to(curveRef.current, {
        strokeDashoffset: curveLen.current,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [isHovered, isEntering, showHint]);

  useEffect(() => {
    if (!isEntering || !perimBuilt.current) return;
    if (!perimRef.current || !curveRef.current) return;

    const pLen = perimLen.current;
    const el = perimRef.current;

    const snake = pLen * 0.12;
    const travelEnd = pLen * 0.92;

    gsap.killTweensOf(curveRef.current);

    gsap.to(curveRef.current, {
      opacity: 0,
      duration: 0.2,
    });

    const proxy = {
      drawn: 0,
      tail: 0,
    };

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
      .to(proxy, {
        drawn: snake,
        duration: 0.3,
        ease: "power2.out",
      })
      .to(proxy, {
        tail: travelEnd,
        duration: 1.8,
        ease: "power1.inOut",
      })
      .to(
        proxy,
        {
          drawn: 0,
          duration: 0.45,
          ease: "power2.in",
        },
        "-=0.45"
      );
  }, [isEntering, href, router]);

  const handleClick = (e) => {
    e.preventDefault();

    if (isEntering) return;

    if (!perimRef.current || !perimLen.current || perimLen.current === 0) {
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
        className="relative inline-block overflow-hidden max-w-[92vw] md:max-w-[640px]"
        aria-label={lang === "es" ? "Ver residencia" : "View residency"}
      >
        <img
          ref={imgRef}
          src={cover.src}
          alt={title || ""}
          draggable={false}
          onLoad={handleImageReady}
          className={`
            w-full max-w-[92vw] md:max-w-[760px]
            h-auto max-h-[74vh] md:max-h-[78vh]
            object-contain cursor-pointer
            transition-all duration-700 ease-out
            opacity-0 animate-fadeIn

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
              absolute bottom-5 left-5 md:bottom-7 md:left-7
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
                d="M2 18 L18 18 L18 12 L34 12 L34 19 L52 19 L52 10 L70 10 L70 16 L88 16 L88 8 L110 8"
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
                  ? {
                      opacity: 0,
                      transform: "translateX(6px)",
                    }
                  : undefined
              }
            >
              {lang === "es" ? "Ver residencia" : "View residency"}
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
            style={{
              mixBlendMode: "difference",
            }}
          />
        </svg>
      </Link>
    </div>
  );
}