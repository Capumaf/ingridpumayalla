"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";

const STORAGE_KEY = "cookie-consent";

export default function CookieConsent() {
  const pathname = usePathname();
  const lang = pathname?.startsWith("/es") ? "es" : "en";

  const [consent, setConsent] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setConsent(localStorage.getItem(STORAGE_KEY));
    } catch {
      setConsent("rejected");
    }
  }, []);

  const handleChoice = (choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {}
    setConsent(choice);
  };

  return (
    <>
      {consent === "accepted" && <Analytics />}

      {mounted && consent === null && (
        <div
          className="
            fixed bottom-0 inset-x-0 z-[200]
            bg-[#faf8f5] border-t border-neutral-200
            px-5 py-4 md:px-8 md:py-4
            flex flex-col md:flex-row md:items-center md:justify-between
            gap-3
          "
        >
          <p className="text-xs text-neutral-600 leading-relaxed max-w-2xl">
            {lang === "es"
              ? "Este sitio usa analítica anónima para saber cuántas visitas recibe. No se usa para identificarte ni para publicidad."
              : "This site uses anonymous analytics to see how many visits it gets. It is not used to identify you or for advertising."}
          </p>

          <div className="flex items-center gap-5 shrink-0">
            <button
              type="button"
              onClick={() => handleChoice("rejected")}
              className="text-xs tracking-widest text-neutral-500 hover:text-black transition-colors"
            >
              {lang === "es" ? "Rechazar" : "Reject"}
            </button>

            <button
              type="button"
              onClick={() => handleChoice("accepted")}
              className="text-xs tracking-widest text-white bg-[#b7623b] px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              {lang === "es" ? "Aceptar" : "Accept"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
