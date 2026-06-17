"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function BioCover({ href, label, imageSrc, imageAlt }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const linkRef = useRef(null);
  const perimRef = useRef(null);
  const curveRef = useRef(null);
  const hintTimerRef = useRef(null);
  const isMobileRef = useRef(false);

  const perimLen = useRef(0);
  const curveLen = useRef(95);

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
  };

  const triggerHint = () => {
    setShowHint(true);

    if (!isMobileRef.current) {
      clearTimeout(hintTimerRef.current);
      hintTimerRef.current = setTimeout(() => {
        setShowHint(false);
      }, 5000);
    }
  };

  useEffect(() => {
    isMobileRef.current = window.matchMedia("(pointer: coarse)").matches;

    requestAnimationFrame(buildPerimeter);
    window.addEventListener("resize", buildPerimeter);

    return () => {
      window.removeEventListener("resize", buildPerimeter);
    };
  }, []);

  useEffect(() => {
    const firstHint = setTimeout(() => {
      triggerHint();
    }, 900);

    const handleScroll = () => {
      triggerHint();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(firstHint);
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
        duration: 1.15,
        ease: "power2.out",
      });
    } else {
      gsap.to(curveRef.current, {
        strokeDashoffset: curveLen.current,
        opacity: 0,
        duration: 0.75,
        ease: "power2.in",
      });
    }
  }, [isHovered, showHint, isEntering]);

  useEffect(() => {
    if (!isEntering) return;

    const fallback = setTimeout(() => {
      window.location.href = href;
    }, 2300);

    if (!perimRef.current || !curveRef.current || perimLen.current === 0) {
      window.location.href = href;
      return;
    }

    const pLen = perimLen.current;
    const el = perimRef.current;

    const snake = pLen * 0.33;
    const travelEnd = pLen * 0.84;

    gsap.killTweensOf(curveRef.current);

    gsap.to(curveRef.current, {
      opacity: 0,
      duration: 0.55,
      ease: "power2.inOut",
    });

    const proxy = { drawn: 0, tail: 0 };

    el.style.opacity = "1";

    const tl = gsap.timeline({
      onUpdate: () => {
        el.style.strokeDasharray = `${proxy.drawn} ${pLen - proxy.drawn}`;
        el.style.strokeDashoffset = `-${proxy.tail}`;
      },
      onComplete: () => {
        clearTimeout(fallback);
        gsap.to(el, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            window.location.href = href;
          },
        });
      },
    });

    tl.to(proxy, { drawn: snake, duration: 0.35, ease: "power2.out" }, "+=0.35")
      .to(proxy, { tail: travelEnd, duration: 2.4, ease: "power1.inOut" })
      .to(proxy, { drawn: 0, duration: 0.45, ease: "power2.in" }, "-=0.45");

    return () => clearTimeout(fallback);
  }, [isEntering, href]);

  const handleClick = (e) => {
    e.preventDefault();
    if (isEntering) return;
    buildPerimeter();
    if (!perimRef.current || !perimLen.current || perimLen.current === 0) {
      window.location.href = href;
      return;
    }
    setIsEntering(true);
  };

  return (
    <div className="flex justify-center w-full pl-0 md:pl-[95px]">
      <Link
        ref={linkRef}
        href={href}
        onClick={handleClick}
        onMouseEnter={() => !isEntering && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative block overflow-hidden w-full md:w-auto"
        aria-label={label}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          onLoad={buildPerimeter}
          loading="eager"
          fetchPriority="high"
          className={`
            w-full
            h-auto
            max-h-[72svh]
            md:max-w-[760px]
            md:max-h-[78vh]
            object-contain
            cursor-pointer
            transition-all
            duration-700
            ease-out
            opacity-0
            animate-fadeIn
            ${isEntering ? "brightness-[0.96]" : isHovered ? "scale-[1.01] brightness-[1.03]" : ""}
          `}
        />

        <div
          className={`
            absolute inset-0
            transition-opacity duration-700
            pointer-events-none
            ${showHint ? "opacity-100" : "opacity-0"}
            ${isHovered || isEntering ? "opacity-100" : ""}
          `}
        >
          <div
            className={`
              absolute bottom-5 left-5 md:bottom-7 md:left-7
              flex items-center gap-3
              text-white
              transition-transform duration-700
              ${isHovered || isEntering || showHint ? "translate-y-0" : "translate-y-2"}
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
              className="
                text-[9px] md:text-[10px]
                tracking-[0.2em] md:tracking-[0.24em]
                uppercase
                font-light
                px-2.5 md:px-3
                py-[5px] md:py-[6px]
                rounded-full
                backdrop-blur-md
                bg-black/35
                text-white
                border border-white/15
                shadow-[0_4px_18px_rgba(0,0,0,0.35)]
              "
              style={isEntering ? { opacity: 0, transform: "translateX(6px)" } : undefined}
            >
              {label}
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