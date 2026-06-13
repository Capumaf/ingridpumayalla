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

const SLIDE_DURATION = 900;
const BRAID_DUR      = 10000;
const IMAGES         = images.length;

function noise(x)  { const s = Math.sin(x * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function noise2(x) { const s = Math.sin(x * 91.3  + 127.4) * 27841.231;  return s - Math.floor(s); }

const DEFS = [
  { r:183, g:98,  b:59,  bw:1.45, amp:5.8, period:110, phase:0              },
  { r:158, g:52,  b:32,  bw:1.60, amp:5.0, period:100, phase:Math.PI*0.71   },
  { r:208, g:118, b:72,  bw:1.30, amp:6.4, period:118, phase:Math.PI*1.38   },
];
const VDEFS = [
  { r:183, g:98,  b:59 },
  { r:158, g:52,  b:32 },
];
const LENGTHS = [36, 48, 29, 56, 41, 24, 52, 34];

function buildBraid(W, BRAID_Y) {
  const xStart  = W * 0.07, xEnd = W * 0.93, TOTAL_W = xEnd - xStart;
  const SINGLE_IN = TOTAL_W*0.13, SINGLE_OUT = TOTAL_W*0.13;
  const OPEN = TOTAL_W*0.09, CLOSE_START = TOTAL_W-SINGLE_OUT-OPEN;
  const MZ = [0.38,0.62], MW = 0.09, N = 1200;

  return DEFS.map((def, idx) => {
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const t = i/N, x = xStart+TOTAL_W*t, dx = x-xStart;
      let sp;
      if (dx<SINGLE_IN) sp=0;
      else if (dx<SINGLE_IN+OPEN) { const e=(dx-SINGLE_IN)/OPEN; sp=e*e*(3-2*e); }
      else if (dx<CLOSE_START) sp=1;
      else if (dx<CLOSE_START+OPEN) { const e=(dx-CLOSE_START)/OPEN; sp=1-e*e*(3-2*e); }
      else sp=0;
      let mg=0;
      for (const mz of MZ) {
        const c=TOTAL_W*mz, h=TOTAL_W*MW*0.5, d=Math.abs(dx-c);
        if (d<h) { const e=1-d/h; mg=Math.max(mg,e*e*(3-2*e)); }
      }
      const es=sp*(1-mg);
      const ph=(dx/def.period)*Math.PI*2+def.phase;
      const ch=es;
      const y=(Math.sin(ph)*def.amp*(0.93+noise(x*0.004+idx*2.7)*0.10*(0.4+ch*0.6))
              +(noise(x*0.006+idx*9.3)-0.5)*0.5*ch
              +(noise2(x*0.004+idx*4.1)-0.5)*0.3*ch
              +(noise(x*0.02+idx*6.3)-0.5)*0.15*ch)*es;
      const arcOffset = Math.sin(t * Math.PI) * 17;
      pts.push({ x, y: BRAID_Y+y+(idx-1)*0.6*(1-es)+arcOffset });
    }
    return pts;
  });
}

function buildVThreads(W, BRAID_Y) {
  const xStart = W*0.07, xEnd = W*0.93;
  const vxStart = W*0.32, vxEnd = W*0.68;

  return Array.from({ length: IMAGES }, (_, i) => {
    const cx = (vxStart+(vxEnd-vxStart)/(IMAGES-1)*i)+(noise(i*3.7)-0.5)*5;
    const len = LENGTHS[i];
    const period = 16+noise(i*5.1)*10;
    const phase  = noise(i*9.7)*Math.PI*2;
    const sep    = 0.7+noise(i*4.1)*0.5;
    const N = 300;
    const pts = [[], []];
    const tBraid = (cx-xStart)/(xEnd-xStart);
    const arcAtX = Math.sin(tBraid*Math.PI)*17;
    const startY = BRAID_Y+arcAtX+3;
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

function depthAt(si, x, xStart) {
  const def=DEFS[si], dx=x-xStart, ph=(dx/def.period)*Math.PI*2+def.phase;
  return Math.sin(ph);
}
function lineW(def, x, idx, base) {
  const v=noise(x*0.028+idx*5.3)*0.16+noise2(x*0.014+idx*3.1)*0.08;
  return base*def.bw*(0.84+v);
}
function easeBraid(t) {
  if (t<0.04) return t*t*7;
  if (t>0.93) { const e=(t-0.93)/0.07; return 0.93+e*0.07*0.30; }
  return Math.max(0,Math.min(1,t-Math.sin(t*Math.PI)*0.09*t*(1-t)*3.2+Math.sin(t*Math.PI*3.9)*0.007));
}
function easeThread(t) { return 1-Math.pow(1-t,2.6); }

function QuipuCanvas({ onThreadComplete, onAllDone, resetKey }) {
  const canvasRef        = useRef(null);
  const rafRef           = useRef(0);
  const stateRef         = useRef(null);
  const onThreadCompleteRef = useRef(onThreadComplete);
  const onAllDoneRef        = useRef(onAllDone);

  useEffect(() => { onThreadCompleteRef.current = onThreadComplete; }, [onThreadComplete]);
  useEffect(() => { onAllDoneRef.current = onAllDone; }, [onAllDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr  = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = Math.min((canvas.parentElement?.offsetWidth || 500) * 0.75, 620);
    const cssH = 120;

    canvas.width        = cssW * dpr;
    canvas.height       = cssH * dpr;
    canvas.style.width  = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const W = cssW, H = cssH;
    const BRAID_Y  = 16;
    const xStart   = W * 0.07;

    const BRAID    = buildBraid(W, BRAID_Y);
    const BSLEN    = BRAID[0].length;
    const VTHREADS = buildVThreads(W, BRAID_Y);

    stateRef.current = {
      phase: 'braid',
      braidStart: null,
      currentThread: 0,
      completedThreads: [],
      threadStart: null,
    };

    function drawBraid(progress) {
      const count = Math.floor(progress * BSLEN);
      if (count < 2) return;
      const CHUNK = 3;
      for (let seg = 0; seg < count-CHUNK; seg += CHUNK) {
        const end  = Math.min(seg+CHUNK+1, count);
        const xMid = BRAID[0][seg+Math.floor(CHUNK/2)].x;
        const order = [0,1,2].sort((a,b) => depthAt(a,xMid,xStart)-depthAt(b,xMid,xStart));
        for (const si of order) {
          const pts=BRAID[si], def=DEFS[si];
          ctx.globalAlpha=0.06;
          ctx.beginPath();
          for (let i=seg;i<end;i++) { const p=pts[i]; i===seg?ctx.moveTo(p.x,p.y+1.5):ctx.lineTo(p.x,p.y+1.5); }
          ctx.strokeStyle=`rgba(50,3,5,0.6)`; ctx.lineWidth=lineW(def,xMid,si,2.0);
          ctx.lineCap='round'; ctx.lineJoin='round'; ctx.stroke();
          ctx.globalAlpha=0.90;
          ctx.beginPath();
          for (let i=seg;i<end;i++) { const p=pts[i]; i===seg?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y); }
          ctx.strokeStyle=`rgba(${def.r},${def.g},${def.b},1)`; ctx.lineWidth=lineW(def,xMid,si,1.1); ctx.stroke();
        }
      }
      ctx.globalAlpha=1;
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
        drawBraid(easeBraid(rawT));
        for (const i of s.completedThreads) drawVThread(VTHREADS[i], 1);
        if (rawT >= 1) { s.phase='thread'; s.threadStart=null; }

      } else if (s.phase === 'thread') {
        if (!s.threadStart) s.threadStart = ts;
        const vt  = VTHREADS[s.currentThread];
        const dur = 1200+vt.len*12;
        const rawT = Math.min((ts-s.threadStart)/dur, 1);
        drawBraid(1);
        for (const i of s.completedThreads) drawVThread(VTHREADS[i], 1);
        drawVThread(vt, easeThread(rawT));

        if (rawT >= 1) {
          s.completedThreads.push(s.currentThread);
          s.currentThread++;
          onThreadCompleteRef.current(); // → cambio de imagen

          if (s.currentThread >= IMAGES) {
            // Todas pasaron — resetear todo
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
            // Siguiente: trenza ya está, cae el siguiente hilo
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
    <div className="relative w-full flex flex-col items-center justify-center gap-0">
      <div className="relative w-full max-w-[90vw] aspect-[3/4] max-h-[60svh] md:max-w-none md:max-h-[58vh] overflow-hidden">
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
            transition: isChanging ? `transform ${SLIDE_DURATION}ms cubic-bezier(0.76,0,0.24,1)` : "none",
            transform: isChanging ? "translateX(-100%)" : "translateX(0)",
          }}
        />
        {/* Imagen que entra */}
        <Image
          key={images[nextIdx] + "-in"}
          src={images[nextIdx]}
          alt=""
          fill
          sizes="(max-width: 768px) 84vw, 620px"
          className="object-contain absolute inset-0"
          style={{
            transition: isChanging ? `transform ${SLIDE_DURATION}ms cubic-bezier(0.76,0,0.24,1)` : "none",
            transform: isChanging ? "translateX(0)" : "translateX(100%)",
          }}
        />
      </div>

      <div className="mt-3 md:mt-4 flex justify-center w-full flex-shrink-0">
        <QuipuCanvas
          onThreadComplete={handleThreadComplete}
          onAllDone={handleAllDone}
          resetKey={resetKey}
        />
      </div>
    </div>
  );
}