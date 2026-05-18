"use client";

import Image from "next/image";
import { useState } from "react";

const images = [
  "/Home1.webp",
  "/Home2.webp",
  "/Home3.webp",
  "/Home4.webp",
  "/Home5.webp",
  "/Home6.webp",
  "/Home7.webp",
  "/Home8.webp",
];

const CHANGE_TIME = 5000;
const FADE_TIME = 1000;

export default function HomeTransmutationImage() {
  const [current, setCurrent] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  const goNext = () => {
    if (!images.length || isChanging) return;

    setIsChanging(true);

    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
      setIsChanging(false);
    }, FADE_TIME);
  };

  if (!images.length) return null;

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      <button
        type="button"
        onClick={goNext}
        className={`
          relative
          w-full
          max-w-[84vw]
          aspect-[3/4]
          max-h-[64svh]
          md:max-w-none
          md:max-h-[62vh]
          block
          overflow-hidden
          cursor-pointer
        `}
        aria-label="Change image"
      >
        <Image
          key={images[current]}
          src={images[current]}
          alt=""
          fill
          priority={current === 0}
          className={
            "object-contain transition-all duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] " +
            (isChanging
              ? "opacity-0 scale-[1.012] blur-[8px] saturate-[0.86]"
              : "opacity-100 scale-100 blur-0 saturate-100")
          }
        />
      </button>

      <div className="mt-3 md:mt-6 flex justify-center w-full">
        <svg
          key={current}
          width="340"
          height="18"
          viewBox="0 0 340 18"
          fill="none"
          aria-hidden="true"
          className="w-[78vw] max-w-[340px]"
        >
          <path
            d="M2 12 L78 12 L78 8 L128 8 L128 13 L188 13 L188 7 L252 7 L252 11 L338 11"
            stroke="rgba(0,0,0,0.16)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          <path
            d="M2 12 L78 12 L78 8 L128 8 L128 13 L188 13 L188 7 L252 7 L252 11 L338 11"
            stroke="rgba(0,0,0,0.48)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            pathLength="100"
            className="progress-thread"
            onAnimationEnd={goNext}
          />
        </svg>
      </div>

      <style jsx>{`
        .progress-thread {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: drawThread ${CHANGE_TIME}ms linear forwards;
        }

        @keyframes drawThread {
          from {
            stroke-dashoffset: 100;
          }

          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}