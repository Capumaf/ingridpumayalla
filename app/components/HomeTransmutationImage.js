"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { projectDetails } from "@/data/projectDetails";

const images = Object.values(projectDetails)
  .filter((project) => project.imageData?.length > 0)
  .map((project) => project.imageData[0].src);

const routes = [
  {
    type: "modularTopOrange",
    color: "rgba(224, 62, 17, 0.78)",
    innerColor: "rgb(0, 0, 0)",
    strokeWidth: 4.4,
    innerWidth: 1,
    visible: 0.12,
    duration: 13,
    d: `
      M -260 230
      L 120 230
      L 120 300
      L 340 300
      L 340 245
      L 560 245
      L 560 340
      L 720 340
      L 720 420
      L 940 420
      L 940 350
      L 1160 350
      L 1160 280
      L 1700 280
    `,
  },
  {
    type: "modularBottomRed",
    color: "rgba(150,20,20,0.88)",
    innerColor: "rgb(255,255,255)",
    strokeWidth: 4.8,
    innerWidth: 1.15,
    visible: 0.12,
    duration: 13,
    d: `
      M -260 790
      L 100 790
      L 100 720
      L 300 720
      L 300 650
      L 560 650
      L 560 580
      L 760 580
      L 760 500
      L 990 500
      L 990 565
      L 1220 565
      L 1220 510
      L 1700 510
    `,
  },
  {
    type: "modularMiddlePurple",
    color: "rgba(80, 19, 212, 0.76)",
    innerColor: "rgb(0, 0, 0)",
    strokeWidth: 4.2,
    innerWidth: 1,
    visible: 0.11,
    duration: 12,
    d: `
      M -260 500
      L 80 500
      L 80 455
      L 260 455
      L 260 530
      L 460 530
      L 460 470
      L 650 470
      L 650 535
      L 850 535
      L 850 455
      L 1080 455
      L 1080 520
      L 1320 520
      L 1320 475
      L 1700 475
    `,
  },
  {
    type: "verticalLeftRed",
    color: "rgba(236,51,51,0.84)",
    innerColor: "rgb(0, 0, 0)",
    strokeWidth: 5,
    innerWidth: 1,
    visible: 0.16,
    duration: 15,
    d: `
      M 260 -180
      L 260 120
      L 360 120
      L 360 260
      L 520 260
      L 520 410
      L 680 410
      L 680 560
      L 560 560
      L 560 720
      L 440 720
      L 440 1080
    `,
  },
  {
    type: "verticalCenterBlack",
    color: "rgba(0,0,0,0.84)",
    innerColor: "rgb(255,255,255)",
    strokeWidth: 4.6,
    innerWidth: 1,
    visible: 0.16,
    duration: 15,
    d: `
      M 720 -180
      L 720 120
      L 820 120
      L 820 260
      L 700 260
      L 700 410
      L 860 410
      L 860 560
      L 740 560
      L 740 720
      L 800 720
      L 800 1080
    `,
  },
  {
    type: "verticalRightGreen",
    color: "rgba(53, 179, 63, 0.82)",
    innerColor: "rgb(0, 0, 0)",
    strokeWidth: 4.4,
    innerWidth: 1,
    visible: 0.15,
    duration: 14,
    d: `
      M 1120 -180
      L 1120 140
      L 1010 140
      L 1010 280
      L 900 280
      L 900 430
      L 1030 430
      L 1030 590
      L 930 590
      L 930 760
      L 980 760
      L 980 1080
    `,
  },
  {
    type: "largeModularRed",
    color: "rgba(145,18,18,0.88)",
    innerColor: "rgb(255,255,255)",
    strokeWidth: 4.8,
    innerWidth: 1.1,
    visible: 0.13,
    duration: 14,
    d: `
      M -260 660
      L 40 660
      L 40 590
      L 240 590
      L 240 520
      L 500 520
      L 500 450
      L 740 450
      L 740 360
      L 980 360
      L 980 430
      L 1220 430
      L 1220 350
      L 1700 350
    `,
  },
  {
    type: "reverseModularMagenta",
    color: "rgba(219, 14, 219, 0.74)",
    innerColor: "rgb(0, 0, 0)",
    strokeWidth: 4,
    innerWidth: 1,
    visible: 0.12,
    duration: 13,
    d: `
      M 1700 210
      L 1360 210
      L 1360 285
      L 1160 285
      L 1160 360
      L 950 360
      L 950 450
      L 760 450
      L 760 560
      L 560 560
      L 560 670
      L 320 670
      L 320 760
      L -260 760
    `,
  },
  {
    type: "bottomRiseGreen",
    color: "rgba(0,0,0,0.78)",
    innerColor: "rgb(38, 147, 28)",
    strokeWidth: 4.2,
    innerWidth: 1,
    visible: 0.13,
    duration: 14,
    d: `
      M 520 1080
      L 520 820
      L 650 820
      L 650 650
      L 560 650
      L 560 520
      L 760 520
      L 760 390
      L 690 390
      L 690 240
      L 780 240
      L 780 -180
    `,
  },
  {
    type: "hybridOrganicThread",
    color: "rgba(0,0,0,0.76)",
    innerColor: "rgb(255,255,255)",
    strokeWidth: 4.1,
    innerWidth: 1,
    visible: 0.13,
    duration: 15,
    d: `
      M -260 840
      C 80 800, 260 710, 500 625
      L 620 625
      L 620 500
      C 720 455, 820 410, 960 365
      L 1080 365
      L 1080 260
      C 1260 190, 1460 130, 1700 90
    `,
  },
];

export default function HomeTransmutationImage() {
  const [current, setCurrent] = useState(0);
  const [routeIndex, setRouteIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  const shadowThreadRef = useRef(null);
  const mainThreadRef = useRef(null);
  const innerThreadRef = useRef(null);
  const tl = useRef(null);

  const route = routes[routeIndex];

  const changeImage = () => {
    setIsChanging(true);

    window.setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
      setRouteIndex((prev) => (prev + 1) % routes.length);
      setIsChanging(false);
    }, 700);
  };

  const startThread = () => {
    if (!mainThreadRef.current) return;

    if (tl.current) {
      tl.current.kill();
    }

    const animatedPaths = [
      shadowThreadRef.current,
      mainThreadRef.current,
      innerThreadRef.current,
    ].filter(Boolean);

    const length = mainThreadRef.current.getTotalLength();
    const visibleThread = length * route.visible;

    const proxy = {
      head: -visibleThread,
    };

    animatedPaths.forEach((path) => {
      gsap.set(path, {
        strokeDasharray: `${visibleThread} ${length}`,
        strokeDashoffset: visibleThread,
        opacity: 1,
      });
    });

    tl.current = gsap.timeline({
      onUpdate: () => {
        const offset = -proxy.head;

        animatedPaths.forEach((path) => {
          path.style.strokeDashoffset = offset;
        });
      },
      onComplete: () => {
        animatedPaths.forEach((path) => {
          gsap.set(path, {
            opacity: 0,
            strokeDashoffset: length + visibleThread,
          });
        });

        changeImage();
      },
    });

    tl.current
      .to(proxy, {
        head: length,
        duration: route.duration * 0.92,
        ease: "power1.inOut",
      })
      .to(
        animatedPaths,
        {
          opacity: 0,
          duration: 0.15,
          ease: "power2.out",
        },
        "-=0.15"
      );
  };

  useEffect(() => {
    const frame = requestAnimationFrame(startThread);

    return () => {
      cancelAnimationFrame(frame);

      if (tl.current) {
        tl.current.kill();
      }
    };
  }, [routeIndex]);

  const handleClick = () => {
    if (tl.current) {
      tl.current.kill();
    }

    changeImage();
  };

  if (!images.length) {
    return null;
  }

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={handleClick}
        className="
          relative
          z-10
          w-full
          aspect-[3/4]
          max-h-[62vh]
          mx-auto
          block
          overflow-hidden
          cursor-pointer
        "
        aria-label="Change image"
      >
        <Image
          key={images[current]}
          src={images[current]}
          alt=""
          fill
          priority={current === 0}
          className={`
            object-contain
            transition-all
            duration-[1200ms]
            ease-[cubic-bezier(0.22,1,0.36,1)]

            ${
              isChanging
                ? "opacity-0 scale-[1.02] blur-[12px] saturate-[0.8]"
                : "opacity-100 scale-100 blur-0 saturate-100"
            }
          `}
        />
      </button>

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-20
          overflow-hidden
        "
      >
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          className="block w-full h-full"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <filter id="threadShadow">
              <feDropShadow
                dx="2"
                dy="4"
                stdDeviation="1.4"
                floodOpacity="0.16"
              />
            </filter>
          </defs>

          <path
            ref={shadowThreadRef}
            d={route.d}
            stroke="rgba(0,0,0,0.12)"
            strokeWidth={route.strokeWidth + 2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter="url(#threadShadow)"
          />

          <path
            ref={mainThreadRef}
            d={route.d}
            stroke={route.color}
            strokeWidth={route.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter="url(#threadShadow)"
          />

          <path
            ref={innerThreadRef}
            d={route.d}
            stroke={route.innerColor}
            strokeWidth={route.innerWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.7"
          />
        </svg>
      </div>
    </div>
  );
}