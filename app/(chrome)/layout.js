"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useParams } from "next/navigation";
import React from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const AUTOHIDE_MS = 10000;

export default function ChromeLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang } = useParams(); // ✅ idioma desde URL

  const toggleLang = () => {
    const newLang = lang === "es" ? "en" : "es";
    const newPath = pathname.replace(/^\/(en|es)/, `/${newLang}`);
    router.push(newPath);
  };

  const isHome = pathname.endsWith("/home");

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const showMenuRef = useRef(false);
  const hideMenuTimerRef = useRef(null);
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

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    if (!mql.matches) return;

    const onMouseMove = () => {
      if (mouseRafRef.current) return;
      mouseRafRef.current = requestAnimationFrame(() => {
        mouseRafRef.current = null;
        showMenuWithAutoHide();
      });
    };

    const onMouseDown = (e) => {
      if (showMenuRef.current) {
        if (menuRef.current && !menuRef.current.contains(e.target)) hideMenu();
        return;
      }
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

  useEffect(() => {
    hideMenu();
  }, [pathname, hideMenu]);

  return (
    <div className="min-h-dvh bg-white text-black">

      {/* MOBILE */}
      <div className="md:hidden">
        <Sidebar lang={lang} toggleLang={toggleLang} />
      </div>

      {/* DESKTOP */}
      <div
        ref={menuRef}
        onMouseEnter={clearHideTimer}
        onMouseLeave={startHideTimer}
        className={`
          hidden md:block fixed top-6 left-8 z-50
          transition-all duration-300 ease-out
          ${
            showMenu
              ? "opacity-100 translate-x-0"
              : "opacity-90 -translate-x-[2px]"
          }
        `}
      >
        <Sidebar lang={lang} toggleLang={toggleLang} />
      </div>

      {/* HOME */}
      {isHome ? (
        <div className="min-h-dvh flex flex-col">
          <div className="flex-1 grid place-items-center pt-4 md:pt-0">
            {React.isValidElement(children)
              ? React.cloneElement(children, { lang })
              : children}
          </div>
          <div className="pb-6 pt-2 text-center">
            <Footer />
          </div>
        </div>
      ) : (
        <div className="min-h-dvh flex flex-col">
          <main className="flex-1">
            <div className="mx-auto max-w-4xl px-6 py-10">
              {React.isValidElement(children)
                ? React.cloneElement(children, { lang })
                : children}
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