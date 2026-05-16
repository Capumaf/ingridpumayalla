export default function Footer() {
  return (
    <footer className="w-full py-8">
      {/* MOBILE */}
      <div className="md:hidden flex justify-center px-6">
        <p className="text-center text-[11px] text-neutral-400 tracking-wide hover:text-neutral-700 transition-colors">
          Ingridpumayalla.com · © 2026 · Site by NinanStudio
        </p>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex ml-[240px] w-[calc(100%-300px)] justify-center">
        <p className="text-[11px] text-neutral-400 tracking-wide hover:text-neutral-700 transition-colors">
          Ingridpumayalla.com · © 2026 · Site by NinanStudio
        </p>
      </div>
    </footer>
  );
}