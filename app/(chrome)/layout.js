"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const EDGE_PX = 140;
const AUTOHIDE_MS = 2500; // más sutil

export default function ChromeLayout({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/home";

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const showMenuRef = useRef(false);
  const hideMenuTimerRef = useRef(null);

  const isNearLeftEdge = useCallback((x) => typeof x === "number" && x <= EDGE_PX, []);

  const hideMenu = useCallback(() => {
    showMenuRef.current = false;
    setShowMenu(false);
    if (hideMenuTimerRef.current) clearTimeout(hideMenuTimerRef.current);
    hideMenuTimerRef.current = null;
  }, []);

  const showMenuWithAutoHide = useCallback(() => {
    showMenuRef.current = true;
    setShowMenu(true);

    if (hideMenuTimerRef.current) clearTimeout(hideMenuTimerRef.current);
    hideMenuTimerRef.current = setTimeout(() => {
      showMenuRef.current = false;
      setShowMenu(false);
    }, AUTOHIDE_MS);
  }, []);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isNearLeftEdge(e.clientX)) return;
      showMenuWithAutoHide();
    };

    const onMouseDown = (e) => {
      if (showMenuRef.current) {
        if (menuRef.current && !menuRef.current.contains(e.target)) hideMenu();
        return;
      }
      if (!isNearLeftEdge(e.clientX)) return;
      showMenuWithAutoHide();
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") hideMenu();
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      if (hideMenuTimerRef.current) clearTimeout(hideMenuTimerRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [hideMenu, isNearLeftEdge, showMenuWithAutoHide]);

  return (
    <div className="min-h-dvh bg-white text-black">
      {/* Zona de borde */}
      <div className="fixed left-0 top-0 h-dvh w-[140px] z-10" />

      {/* Sidebar flotante (sutil: fade + micro-slide, sin caja) */}
      <div
        ref={menuRef}
        className={`
          fixed top-6 left-8 z-50
          transition-all duration-300 ease-out
          ${showMenu ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3 pointer-events-none"}
        `}
      >
        <Sidebar />
      </div>

      {/* HOME: centrado en pantalla */}
      {isHome ? (
        <div className="min-h-dvh flex flex-col">
          <div className="flex-1 grid place-items-center">
            {children}
          </div>
          <div className="pb-6 pt-2 text-center">
            <Footer />
          </div>
        </div>
      ) : (
        /* OTRAS PÁGINAS: contenedor centrado + scroll normal */
        <div className="min-h-dvh flex flex-col">
          <main className="flex-1">
            <div className="mx-auto max-w-4xl px-6 py-10">
              {children}
            </div>
          </main>
          <div className="pb-6 pt-2 text-center">
            <Footer />
          </div>
        </div>
      )}
    </div>
  );
}
