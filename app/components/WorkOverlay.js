"use client";

import LivingThread from "@/components/LivingThread";

export default function WorkOverlay({ lang, isHovered = false, isEntering = false, onThreadComplete }) {
  return (
    <div
      className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
      style={{ opacity: isHovered || isEntering ? 1 : 0 }}
    >
      {/* Marco interior — el hilo lo recorre al click */}
      <div className="absolute inset-5 border border-white/20 mix-blend-difference" />

      {/* Hilo + label abajo izquierda */}
      <div
        className="absolute bottom-7 left-7 flex items-center gap-3 text-white mix-blend-difference transition-transform duration-500"
        style={{ transform: isHovered || isEntering ? "translateY(0)" : "translateY(8px)" }}
      >
        <LivingThread
          isHovered={isHovered}
          isEntering={isEntering}
          onComplete={onThreadComplete}
        />

        <span
          className="text-[10px] tracking-[0.24em] uppercase font-light transition-all duration-400"
          style={isEntering ? { opacity: 0, transform: "translateX(6px)" } : undefined}
        >
          {lang === "es" ? "Ver serie" : "View series"}
        </span>
      </div>
    </div>
  );
}