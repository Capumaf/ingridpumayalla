"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const AUTOHIDE_MS = 10000;

export default function ChromeLayout({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/home";

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const showMenuRef = useRef(false);
  const hideMenuTimerRef = useRef(null);

  // throttle suave para mousemove (evita re-render por cada pixel)
  const mouseRafRef = useRef(null);

  const clearHideTimer = useCallback(() => {
    if (hideMenuTimerRef.current) clearTimeout(hideMenuTimerRef.current);
    hideMenuTimerRef.current = null;
  }, []);

  const startHideTimer = useCallback(() => {
    clearHideTimer();
    hideMenuTimerRef.current = setTimeout(() => {
      showMenuRef.current = false;
      setShowMenu(false);
    }, AUTOHIDE_MS);
  }, [clearHideTimer]);

  const hideMenu = useCallback(() => {
    showMenuRef.current = false;
    setShowMenu(false);
    clearHideTimer();
  }, [clearHideTimer]);

  const showMenuWithAutoHide = useCallback(() => {
    showMenuRef.current = true;
    setShowMenu(true);
    startHideTimer();
  }, [startHideTimer]);

  // Desktop interactions: cualquier movimiento del mouse muestra el menú
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    if (!mql.matches) return;

    const onMouseMove = () => {
      // 1 update por frame como máximo
      if (mouseRafRef.current) return;
      mouseRafRef.current = requestAnimationFrame(() => {
        mouseRafRef.current = null;
        showMenuWithAutoHide();
      });
    };

    const onMouseDown = (e) => {
      // si está abierto y clic fuera, cerrar
      if (showMenuRef.current) {
        if (menuRef.current && !menuRef.current.contains(e.target)) hideMenu();
        return;
      }
      // si está cerrado y haces click, lo mostramos (comportamiento “general”)
      showMenuWithAutoHide();
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") hideMenu();
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      clearHideTimer();
      if (mouseRafRef.current) cancelAnimationFrame(mouseRafRef.current);

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [clearHideTimer, hideMenu, showMenuWithAutoHide]);

  // Al navegar, cierra el menú
  useEffect(() => {
    hideMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="min-h-dvh bg-white text-black">
      {/* MOBILE */}
      <div className="md:hidden">
        <Sidebar />
      </div>

      {/* DESKTOP: sidebar flotante (sin “edge zone”) */}
      <div
        ref={menuRef}
        onMouseEnter={clearHideTimer} // mientras lo usas, no se auto-oculta
        onMouseLeave={startHideTimer} // al salir, empieza el countdown
        className={`
          hidden md:block fixed top-6 left-8 z-50
          transition-all duration-300 ease-out
          ${
            showMenu
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-3 pointer-events-none"
          }
        `}
      >
        <Sidebar />
      </div>

      {/* HOME */}
      {isHome ? (
        <div className="min-h-dvh flex flex-col">
          <div className="flex-1 grid place-items-center pt-4 md:pt-0">
            {children}
          </div>
          <div className="pb-6 pt-2 text-center">
            <Footer />
          </div>
        </div>
      ) : (
        <div className="min-h-dvh flex flex-col">
          <main className="flex-1">
            <div className="mx-auto max-w-4xl px-6 py-10">{children}</div>
          </main>
          <div className="pb-6 pt-2 text-center">
            <Footer />
          </div>
        </div>
      )}
    </div>
  );
}
