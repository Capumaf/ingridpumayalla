"use client";

import Link from "next/link";
import { useState } from "react";

export default function SectionCover({ href, cover, title }) {
  const [isHovered, setIsHovered] = useState(false);

  if (!cover) return null;

  return (
    <div className="flex justify-center">
      <Link
        href={href}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative block w-full max-w-[640px] overflow-hidden"
        aria-label={title}
      >
        {cover.type === "video" ? (
          <video
            src={cover.src}
            autoPlay
            muted
            loop
            playsInline
            className={`
              w-full
              h-auto
              max-h-[72vh]
              object-contain
              cursor-pointer
              transition-all
              duration-700
              ease-out

              ${
                isHovered
                  ? "scale-[1.01] brightness-[1.03]"
                  : ""
              }
            `}
          />
        ) : (
          <img
          src={cover.src}
          alt={title || ""}
          draggable={false}
          className={`
          block
          w-full
          max-w-[640px]
          h-auto
          max-h-[72vh]
          object-contain
          cursor-pointer
          transition-all
          duration-700
          ease-out

    ${isHovered ? "scale-[1.01] brightness-[1.03]" : ""}
  `}
/>
        )}

        <div
          className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
          style={{
            opacity: isHovered ? 1 : 0,
          }}
        >
          <div
            className="
              absolute
              bottom-5
              left-5
              md:bottom-7
              md:left-7
              flex
              items-center
              gap-3
              text-white
              transition-transform
              duration-500
            "
            style={{
              transform: isHovered
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
                text-[9px]
                md:text-[10px]
                tracking-[0.2em]
                md:tracking-[0.24em]
                uppercase
                font-light
                px-2.5
                md:px-3
                py-[5px]
                md:py-[6px]
                rounded-full
                backdrop-blur-md
                bg-black/35
                text-white
                border
                border-white/15
                shadow-[0_4px_18px_rgba(0,0,0,0.35)]
              "
            >
              View series
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}