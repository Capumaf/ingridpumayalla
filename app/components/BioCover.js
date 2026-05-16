"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function BioCover({
  href,
  label,
  imageSrc,
  imageAlt,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const linkRef = useRef(null);
  const perimRef = useRef(null);
  const curveRef = useRef(null);

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

  useEffect(() => {
    requestAnimationFrame(buildPerimeter);

    window.addEventListener("resize", buildPerimeter);

    return () => {
      window.removeEventListener("resize", buildPerimeter);
    };
  }, []);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;

    if (!isTouch) return;

    const showTimer = setTimeout(() => {
      setShowHint(true);
    }, 1800);

    const hideTimer = setTimeout(() => {
      setShowHint(false);
    }, 5200);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (!curveRef.current || isEntering) return;

    gsap.killTweensOf(curveRef.current);

    if (isHovered) {
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
  }, [isHovered, isEntering]);

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

    const tl = gsap.timeline({
      onUpdate: () => {
        el.style.strokeDasharray =
          `${proxy.drawn} ${pLen - proxy.drawn}`;

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

    tl.to(proxy, {
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

    return () => clearTimeout(fallback);
  }, [isEntering, href]);

  const handleClick = (e) => {
    e.preventDefault();

    if (isEntering) return;

    setIsEntering(true);
  };

  return (
    <div className="flex justify-center">
      <Link
        ref={linkRef}
        href={href}
        onClick={handleClick}
        onMouseEnter={() => !isEntering && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative inline-block overflow-hidden max-w-[92vw] md:max-w-[640px]"
        aria-label={label}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          onLoad={buildPerimeter}
          className={`
            w-full max-w-[92vw] md:max-w-[640px]
            h-auto max-h-[74vh] md:max-h-[72vh]
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
          className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
          style={{
            opacity:
              isHovered || isEntering || showHint
                ? 1
                : 0,
          }}
        >
          <div
            className="
              absolute bottom-5 left-5 md:bottom-7 md:left-7
              flex items-center gap-3
              text-white
              transition-transform duration-500
            "
            style={{
              transform:
                isHovered || isEntering || showHint
                  ? "translateY(0)"
                  : "translateY(8px)",
            }}
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
              style={
                isEntering
                  ? {
                      opacity: 0,
                      transform: "translateX(6px)",
                    }
                  : undefined
              }
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
            style={{
              mixBlendMode: "difference",
            }}
          />
        </svg>
      </Link>
    </div>
  );
}