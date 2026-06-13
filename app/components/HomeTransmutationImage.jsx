"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

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

const WEAVE_DURATION = 13000;
const FADE_DURATION  = 1800;

function noise(x)  { const s = Math.sin(x * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function noise2(x) { const s = Math.sin(x * 91.3  + 127.4) * 27841.231;  return s - Math.floor(s); }

const DEFS = [
  { r:183, g:98,  b:59,  bw:1.45, amp: 5.8, period: 110, phase: 0               },
  { r:158, g:52,  b:32,  bw:1.60, amp: 5.0, period: 100, phase: Math.PI * 0.71  },
  { r:208, g:118, b:72,  bw:1.30, amp: 6.4, period: 118, phase: Math.PI * 1.38  },
];

const MERGE_ZONES = [0.38, 0.62];
const MERGE_WIDTH = 0.09;

function mergeAt(dx, TOTAL_W) {
  let merge = 0;
  for (const mz of MERGE_ZONES) {
    const center = TOTAL_W * mz;
    const half   = TOTAL_W * MERGE_WIDTH * 0.5;
    const dist   = Math.abs(dx - center);
    if (dist < half) {
      const e = 1 - dist / half;
      merge = Math.max(merge, e * e * (3 - 2 * e));
    }
  }
  return merge;
}

function buildStrands(W, H) {
  const cy       = H / 2 + 1;
  const xStart   = W * 0.03;
  const xEnd     = W * 0.97;
  const TOTAL_W  = xEnd - xStart;
  const SINGLE_IN   = TOTAL_W * 0.13;
  const SINGLE_OUT  = TOTAL_W * 0.13;
  const OPEN_RANGE  = TOTAL_W * 0.09;
  const CLOSE_START = TOTAL_W - SINGLE_OUT - OPEN_RANGE;
  const N = 1200;

  return DEFS.map((def, idx) => {
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const t  = i / N;
      const x  = xStart + TOTAL_W * t;
      const dx = x - xStart;

      let spread;
      if (dx < SINGLE_IN) {
        spread = 0;
      } else if (dx < SINGLE_IN + OPEN_RANGE) {
        const e = (dx - SINGLE_IN) / OPEN_RANGE;
        spread = e * e * (3 - 2 * e);
      } else if (dx < CLOSE_START) {
        spread = 1;
      } else if (dx < CLOSE_START + OPEN_RANGE) {
        const e = (dx - CLOSE_START) / OPEN_RANGE;
        spread = 1 - e * e * (3 - 2 * e);
      } else {
        spread = 0;
      }

      const merge = mergeAt(dx, TOTAL_W);
      const effectiveSpread = spread * (1 - merge);

      const phase   = (dx / def.period) * Math.PI * 2 + def.phase;
      const chaos   = effectiveSpread;
      const irr1    = (noise(x * 0.006 + idx * 9.3) - 0.5) * 0.5 * chaos;
      const irr2    = (noise2(x * 0.004 + idx * 4.1) - 0.5) * 0.3 * chaos;
      const ampMod  = 0.93 + noise(x * 0.004 + idx * 2.7) * 0.10 * (0.4 + chaos * 0.6);
      const tremble = (noise(x * 0.02 + idx * 6.3) - 0.5) * 0.15 * chaos;

      const y = (Math.sin(phase) * def.amp * ampMod
                + irr1 * 0.5 + irr2 * 0.3 + tremble) * effectiveSpread;

      const paraOff = (idx - 1) * 0.6 * (1 - effectiveSpread);
      pts.push({ x, y: cy + y + paraOff });
    }
    return pts;
  });
}

function depthAt(si, x, xStart) {
  const def   = DEFS[si];
  const dx    = x - xStart;
  const phase = (dx / def.period) * Math.PI * 2 + def.phase;
  return Math.sin(phase);
}

function lineW(def, x, idx, base) {
  const v = noise(x * 0.028 + idx * 5.3) * 0.16 + noise2(x * 0.014 + idx * 3.1) * 0.08;
  return base * def.bw * (0.84 + v);
}

function rgba(def, a) { return `rgba(${def.r},${def.g},${def.b},${a})`; }

function ease(t) {
  if (t < 0.04) return t * t * 7;
  if (t > 0.93) { const e = (t - 0.93) / 0.07; return 0.93 + e * 0.07 * 0.30; }
  const b1 = Math.sin(t * Math.PI * 3.9) * 0.007;
  const centerSlow = Math.sin(t * Math.PI) * 0.09;
  const base = t - centerSlow * t * (1 - t) * 3.2;
  return Math.max(0, Math.min(1, base + b1));
}

function BraidCanvas({ weaveKey, onComplete, direction }) {
  // direction 0=derecha, 1=arriba, 2=izquierda, 3=abajo
  // La trenza va de izq→der en dir 0 y 1, de der→izq en dir 2 y 3
  const isReversed = direction === 2 || direction === 3;
  const canvasRef    = useRef(null);
  const rafRef       = useRef(0);
  const startRef     = useRef(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr  = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = Math.min((canvas.parentElement?.offsetWidth || 500) * 0.92, 820);
    const cssH = 56;

    canvas.width        = cssW * dpr;
    canvas.height       = cssH * dpr;
    canvas.style.width  = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const W = cssW;
    const H = cssH;
    const xStart = W * 0.03;

    const STRANDS = buildStrands(W, H);
    const SLEN    = STRANDS[0].length;

    completedRef.current = false;
    startRef.current     = null;

    function frame(ts) {
      if (!startRef.current) startRef.current = ts;
      const rawT = Math.min((ts - startRef.current) / WEAVE_DURATION, 1);
      const t    = ease(rawT);
      const revealCount = Math.floor(t * SLEN);

      ctx.clearRect(0, 0, W, H);
      if (revealCount < 2) { rafRef.current = requestAnimationFrame(frame); return; }

      const CHUNK = 3;
      for (let seg = 0; seg < revealCount - CHUNK; seg += CHUNK) {
        const end  = Math.min(seg + CHUNK + 1, revealCount);
        const xMid = STRANDS[0][seg + Math.floor(CHUNK / 2)].x;
        const order = [0,1,2].sort((a,b) => depthAt(a, xMid, xStart) - depthAt(b, xMid, xStart));

        for (const si of order) {
          const pts = STRANDS[si];
          const def = DEFS[si];

          // Sombra sutil
          ctx.globalAlpha = 0.06;
          ctx.beginPath();
          for (let i = seg; i < end; i++) {
            const p = pts[i]; i === seg ? ctx.moveTo(p.x, p.y+1.5) : ctx.lineTo(p.x, p.y+1.5);
          }
          ctx.strokeStyle = `rgba(50,3,5,0.6)`;
          ctx.lineWidth   = lineW(def, xMid, si, 2.0);
          ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();

          // Hebra principal
          ctx.globalAlpha = 0.90;
          ctx.beginPath();
          for (let i = seg; i < end; i++) {
            const p = pts[i]; i === seg ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
          }
          ctx.strokeStyle = rgba(def, 1.0);
          ctx.lineWidth   = lineW(def, xMid, si, 1.1); ctx.stroke();
        }
      }

      // Punta activa
      if (revealCount < SLEN) {
        const tip = STRANDS[1][revealCount - 1];
        const p   = 0.55 + Math.sin(ts * 0.008) * 0.45;
        ctx.globalAlpha = 0.08 * p;
        ctx.beginPath(); ctx.arc(tip.x, tip.y, 7*p, 0, Math.PI*2);
        ctx.fillStyle = rgba(DEFS[0], 1); ctx.fill();
        ctx.globalAlpha = 0.78 * p;
        ctx.beginPath(); ctx.arc(tip.x, tip.y, 1.3, 0, Math.PI*2); ctx.fill();
      }

      ctx.globalAlpha = 1;

      if (rawT < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [weaveKey, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="block"
      aria-hidden="true"
      style={{ transform: isReversed ? "scaleX(-1)" : "none" }}
    />
  );
}

export default function HomeTransmutationImage() {
  const [current, setCurrent]       = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [weaveKey, setWeaveKey]     = useState(0);
  const [direction, setDirection]   = useState(0); // 0=derecha, 1=arriba, 2=izquierda, 3=abajo
  const timeoutRef    = useRef(null);
  const isChangingRef = useRef(false);
  const dirCountRef   = useRef(0);

  // Llamado por el canvas cuando termina — siempre ejecuta sin guards de estado
  const handleBraidComplete = useCallback(() => {
    if (isChangingRef.current) return;
    isChangingRef.current = true;

    setIsChanging(true);
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
      setDirection((prev) => {
        // Péndulo: 0→1→2→3→2→1→0→1→2→3...
        // Usamos el índice global para calcular la posición en el péndulo
        const seq = [0, 1, 2, 3, 2, 1]; // ciclo completo de ida y vuelta
        const nextCount = dirCountRef.current + 1;
        dirCountRef.current = nextCount;
        return seq[nextCount % seq.length];
      });
      setIsChanging(false);
      setWeaveKey((prev) => prev + 1);
      isChangingRef.current = false;
    }, 950);
  }, []);

  // Click manual
  const goNext = useCallback(() => {
    if (isChangingRef.current || !images.length) return;
    handleBraidComplete();
  }, [handleBraidComplete]);

  useEffect(() => {
    images.forEach((src) => { const img = new window.Image(); img.src = src; });
    return () => clearTimeout(timeoutRef.current);
  }, []);

  if (!images.length) return null;

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      <div
        className="relative w-full max-w-[84vw] aspect-[3/4] max-h-[64svh] md:max-w-none md:max-h-[62vh] overflow-hidden cursor-pointer"
        onClick={goNext}
      >
        {/* Imagen que sale */}
        <Image
          key={images[current] + "-out"}
          src={images[current]}
          alt=""
          fill
          priority={current === 0}
          sizes="(max-width: 768px) 84vw, 620px"
          className="object-contain absolute inset-0"
          style={{
            transition: isChanging ? "transform 900ms cubic-bezier(0.76,0,0.24,1)" : "none",
            transform: isChanging
              ? direction === 0 ? "translateX(-100%)"
              : direction === 1 ? "translateY(-100%)"
              : direction === 2 ? "translateX(100%)"
              :                   "translateY(100%)"
              : "translate(0,0)",
          }}
        />
        {/* Imagen que entra */}
        <Image
          key={images[(current + 1) % images.length] + "-in"}
          src={images[(current + 1) % images.length]}
          alt=""
          fill
          sizes="(max-width: 768px) 84vw, 620px"
          className="object-contain absolute inset-0"
          style={{
            transition: isChanging ? "transform 900ms cubic-bezier(0.76,0,0.24,1)" : "none",
            transform: isChanging
              ? "translate(0,0)"
              : direction === 0 ? "translateX(100%)"
              : direction === 1 ? "translateY(100%)"
              : direction === 2 ? "translateX(-100%)"
              :                   "translateY(-100%)",
          }}
        />
      </div>
      <div className="mt-5 md:mt-8 flex justify-center w-full">
        <BraidCanvas weaveKey={weaveKey} onComplete={handleBraidComplete} direction={direction} />
      </div>
    </div>
  );
}