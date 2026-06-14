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

const SLIDE_DURATION = 1600;
const BRAID_DUR      = 10000;
const IMAGES         = images.length;

function noise(x)  { const s = Math.sin(x * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function noise2(x) { const s = Math.sin(x * 91.3  + 127.4) * 27841.231;  return s - Math.floor(s); }

// Paleta spondylus
const COL_A = { r:183, g:98,  b:59  };
const COL_B = { r:158, g:52,  b:32  };
const VDEFS = [
  { r:183, g:98,  b:59 },
  { r:158, g:52,  b:32 },
];

const LENGTHS = [62, 82, 58, 95, 70, 52, 86, 64];

const TWIST_PERIOD_BASE = 8;
const TWIST_AMP_BASE    = 1.5;

function tensionFactor(dx) {
  const slow  = Math.sin(dx * 0.045) * 0.5;
  const slow2 = Math.sin(dx * 0.017 + 1.3) * 0.3;
  const n     = (noise(dx * 0.06) - 0.5) * 0.4;
  return 1 + slow * 0.5 + slow2 * 0.35 + n;
}

// ── Cordón principal: torsión Z/S de dos hebras con curvatura tipo collar ────
function buildCord(W, H, dir = 1) {
  const cy      = H / 2;
  const xStart  = W * 0.13;
  const xEnd    = W * 0.87;
  const TOTAL_W = xEnd - xStart;
  const SINGLE_IN  = TOTAL_W * 0.05;
  const OPEN_RANGE = TOTAL_W * 0.06;
  const CLOSE_START = TOTAL_W - SINGLE_IN - OPEN_RANGE;
  const N = 1400;

  const A = [], B = [];
  let accumAngle = 0;
  let prevX = xStart;

  for (let i = 0; i <= N; i++) {
    const t  = i / N;
    const x  = xStart + TOTAL_W * t;
    const dx = x - xStart;

    let spread;
    if (dx < SINGLE_IN) spread = 0;
    else if (dx < SINGLE_IN + OPEN_RANGE) { const e=(dx-SINGLE_IN)/OPEN_RANGE; spread=e*e*(3-2*e); }
    else if (dx < CLOSE_START) spread = 1;
    else if (dx < CLOSE_START + OPEN_RANGE) { const e=(dx-CLOSE_START)/OPEN_RANGE; spread=1-e*e*(3-2*e); }
    else spread = 0;

    const tension    = Math.max(0.4, tensionFactor(dx));
    const localPeriod = TWIST_PERIOD_BASE * tension;
    const localAmp    = TWIST_AMP_BASE * (0.6 + 0.4 * tension);

    const stepX = x - prevX;
    accumAngle += dir * (stepX / localPeriod) * Math.PI * 2;
    prevX = x;
    const angle = accumAngle;

    const ampMod = localAmp * spread;
    const irr    = (noise(x * 0.02) - 0.5) * 0.8 * spread;

    // Curvatura suave hacia abajo en el centro (collar)
    const arcOffset = Math.sin(t * Math.PI) * 22;
    const baseY = cy + arcOffset;

    const yA = baseY + Math.sin(angle) * ampMod + irr;
    const yB = baseY + Math.sin(angle + Math.PI) * ampMod - irr;

    const zA = Math.cos(angle);
    const zB = Math.cos(angle + Math.PI);

    A.push({ x, y: yA, z: zA, dx });
    B.push({ x, y: yB, z: zB, dx });
  }
  return { A, B, xStart, xEnd, TOTAL_W };
}

function lineW(idx, x, base) {
  const v = noise(x * 0.03 + idx * 5.3) * 0.16 + noise2(x * 0.015 + idx * 3.1) * 0.08;
  return base * (0.84 + v);
}

function easeBraid(t) {
  if (t < 0.04) return t * t * 7;
  if (t > 0.93) { const e=(t-0.93)/0.07; return 0.93+e*0.07*0.30; }
  return Math.max(0,Math.min(1, t - Math.sin(t*Math.PI)*0.09*t*(1-t)*3.2 + Math.sin(t*Math.PI*3.9)*0.007));
}
function easeThread(t) { return 1 - Math.pow(1-t, 1.7); }

// ── Hilos verticales (2 hebras) — igual estilo que antes ─────────────────────
function buildVThreads(W, cordYAtX) {
  const xStart = W * 0.07, xEnd = W * 0.93;
  const vxStart = W * 0.32, vxEnd = W * 0.68;

  return Array.from({ length: IMAGES }, (_, i) => {
    const cx = (vxStart+(vxEnd-vxStart)/(IMAGES-1)*i)+(noise(i*3.7)-0.5)*5;
    const len = LENGTHS[i];
    const period = 16+noise(i*5.1)*10;
    const phase  = noise(i*9.7)*Math.PI*2;
    const sep    = 0.7+noise(i*4.1)*0.5;
    const N = 300;
    const pts = [[], []];
    const startY = cordYAtX(cx) + 3;
    for (let j = 0; j <= N; j++) {
      const t = j/N;
      const y = startY+len*t;
      const angle = (t*len/period)*Math.PI*2+phase;
      const spV = t<0.10?t/0.10:t>0.90?(1-t)/0.10:1;
      const offset = Math.sin(angle)*sep*spV;
      const irr = (noise(y*0.031+i*7.3)-0.5)*0.9*spV;
      pts[0].push({ x: cx+offset+irr*0.5, y });
      pts[1].push({ x: cx-offset-irr*0.5, y });
    }
    return { pts, len, period, phase, sep, cx, N,
      lw0: 0.85+noise(i*7.3)*0.3,
      lw1: 0.75+noise(i*3.9)*0.3 };
  });
}

function QuipuCanvas({ onThreadComplete, onAllDone, resetKey }) {
  const canvasRef           = useRef(null);
  const rafRef              = useRef(0);
  const stateRef            = useRef(null);
  const onThreadCompleteRef = useRef(onThreadComplete);
  const onAllDoneRef        = useRef(onAllDone);

  useEffect(() => { onThreadCompleteRef.current = onThreadComplete; }, [onThreadComplete]);
  useEffect(() => { onAllDoneRef.current = onAllDone; }, [onAllDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr  = Math.min(window.devicePixelRatio || 1, 2);
    const parentW  = canvas.parentElement?.offsetWidth || window.innerWidth || 500;
    const isMobile = window.innerWidth < 768;
    const cssW = isMobile
      ? Math.min(parentW * 0.94, window.innerWidth * 0.92)
      : Math.min(parentW * 0.75, 620);
    const cssH = 175;

    canvas.width        = cssW * dpr;
    canvas.height       = cssH * dpr;
    canvas.style.width  = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const W = cssW, H = cssH;
    const CORD = buildCord(W, H, 1);
    const CLEN = CORD.A.length;

    // Función para obtener la Y del cordón en un X dado (interpolación simple)
    function cordYAtX(x) {
      // Buscar el punto más cercano en A
      let best = CORD.A[0];
      let bestDist = Math.abs(CORD.A[0].x - x);
      for (let i = 1; i < CORD.A.length; i++) {
        const d = Math.abs(CORD.A[i].x - x);
        if (d < bestDist) { bestDist = d; best = CORD.A[i]; }
      }
      return best.y;
    }

    const VTHREADS = buildVThreads(W, cordYAtX);

    stateRef.current = {
      phase: 'braid',
      braidStart: null,
      currentThread: 0,
      completedThreads: [],
      threadStart: null,
    };

    function drawCord(progress) {
      const count = Math.floor(progress * CLEN);
      if (count < 2) return;
      const CHUNK = 2;
      for (let seg = 0; seg < count-CHUNK; seg += CHUNK) {
        const end = Math.min(seg+CHUNK+1, count);
        const mid = seg + Math.floor(CHUNK/2);
        const order = CORD.A[mid].z < CORD.B[mid].z ? [0,1] : [1,0];

        for (const si of order) {
          const pts = si===0 ? CORD.A : CORD.B;
          const col = si===0 ? COL_A : COL_B;

          ctx.globalAlpha = 0.07;
          ctx.beginPath();
          for (let i=seg;i<end;i++) { const p=pts[i]; i===seg?ctx.moveTo(p.x,p.y+1.6):ctx.lineTo(p.x,p.y+1.6); }
          ctx.strokeStyle = `rgba(50,3,5,0.6)`;
          ctx.lineWidth   = lineW(si, pts[mid].x, 2.4);
          ctx.lineCap='round'; ctx.lineJoin='round'; ctx.stroke();

          ctx.globalAlpha = 0.92;
          ctx.beginPath();
          for (let i=seg;i<end;i++) { const p=pts[i]; i===seg?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y); }
          ctx.strokeStyle = `rgba(${col.r},${col.g},${col.b},1)`;
          ctx.lineWidth   = lineW(si, pts[mid].x, 1.5); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    }

    function drawVThread(vt, progress) {
      const count = Math.floor(progress * vt.N);
      if (count < 2) return;
      const CHUNK = 4;
      for (let seg=0; seg<count-CHUNK; seg+=CHUNK) {
        const end  = Math.min(seg+CHUNK+1, count);
        const midT = (seg+Math.floor(CHUNK/2))/vt.N;
        const ang  = (midT*vt.len/vt.period)*Math.PI*2+vt.phase;
        const dep  = Math.sin(ang);
        const drawS = (pts, col, lw, top) => {
          ctx.globalAlpha = top ? 0.90 : 0.60;
          ctx.beginPath();
          for (let i=seg;i<end;i++) { const p=pts[i]; i===seg?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y); }
          ctx.strokeStyle=`rgba(${col.r},${col.g},${col.b},1)`;
          ctx.lineWidth=lw; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.stroke();
        };
        if (dep>0) { drawS(vt.pts[1],VDEFS[1],vt.lw1,false); drawS(vt.pts[0],VDEFS[0],vt.lw0,true); }
        else       { drawS(vt.pts[0],VDEFS[0],vt.lw0,false); drawS(vt.pts[1],VDEFS[1],vt.lw1,true); }
      }
      ctx.globalAlpha=1;
    }

    function frame(ts) {
      const s = stateRef.current;
      ctx.clearRect(0, 0, W, H);

      if (s.phase === 'braid') {
        if (!s.braidStart) s.braidStart = ts;
        const rawT = Math.min((ts-s.braidStart)/BRAID_DUR, 1);
        drawCord(easeBraid(rawT));
        for (const i of s.completedThreads) drawVThread(VTHREADS[i], 1);
        if (rawT >= 1) { s.phase='thread'; s.threadStart=null; }

      } else if (s.phase === 'thread') {
        if (!s.threadStart) s.threadStart = ts;
        const vt  = VTHREADS[s.currentThread];
        const dur = 2000+vt.len*7;
        const rawT = Math.min((ts-s.threadStart)/dur, 1);
        drawCord(1);
        for (const i of s.completedThreads) drawVThread(VTHREADS[i], 1);
        drawVThread(vt, easeThread(rawT));

        if (rawT >= 1) {
          s.completedThreads.push(s.currentThread);
          s.currentThread++;
          onThreadCompleteRef.current();

          if (s.currentThread >= IMAGES) {
            setTimeout(() => {
              stateRef.current = {
                phase:'braid', braidStart:null,
                currentThread:0, completedThreads:[], threadStart:null,
              };
              onAllDoneRef.current();
              rafRef.current = requestAnimationFrame(frame);
            }, 800);
            return;
          } else {
            s.phase = 'thread';
            s.threadStart = null;
          }
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [resetKey]);

  return <canvas ref={canvasRef} className="block" aria-hidden="true" />;
}

export default function HomeTransmutationImage() {
  const [current, setCurrent]       = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [resetKey, setResetKey]     = useState(0);
  const timeoutRef    = useRef(null);
  const isChangingRef = useRef(false);

  const handleThreadComplete = useCallback(() => {
    if (isChangingRef.current) return;
    isChangingRef.current = true;
    setIsChanging(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent(prev => (prev + 1) % images.length);
      setIsChanging(false);
      isChangingRef.current = false;
    }, SLIDE_DURATION);
  }, []);

  const handleAllDone = useCallback(() => {
    setResetKey(k => k + 1);
  }, []);

  useEffect(() => {
    images.forEach(src => { const img = new window.Image(); img.src = src; });
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const nextIdx = (current + 1) % images.length;

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      <div className="relative w-full max-w-[90vw] aspect-[3/4] max-h-[52svh] md:max-w-none md:max-h-[50vh] overflow-hidden">
        {/* Imagen actual — se desvanece primero (mitad 1) */}
        <Image
          key={images[current] + "-base"}
          src={images[current]}
          alt=""
          fill
          priority={current === 0}
          sizes="(max-width: 768px) 84vw, 620px"
          className="object-contain absolute inset-0"
          style={{
            transition: isChanging
              ? `opacity ${SLIDE_DURATION/2}ms ease-in 0ms`
              : "none",
            opacity: isChanging ? 0 : 1,
          }}
        />
        {/* Imagen nueva — aparece después (mitad 2) */}
        <Image
          key={images[nextIdx] + "-reveal"}
          src={images[nextIdx]}
          alt=""
          fill
          sizes="(max-width: 768px) 84vw, 620px"
          className="object-contain absolute inset-0"
          style={{
            transition: isChanging
              ? `opacity ${SLIDE_DURATION/2}ms ease-out ${SLIDE_DURATION/2}ms`
              : "none",
            opacity: isChanging ? 1 : 0,
          }}
        />
      </div>

      <div className="-mt-4 md:-mt-6 flex justify-center w-full flex-shrink-0">
        <QuipuCanvas
          onThreadComplete={handleThreadComplete}
          onAllDone={handleAllDone}
          resetKey={resetKey}
        />
      </div>
    </div>
  );
}