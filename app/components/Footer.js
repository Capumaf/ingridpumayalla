export default function Footer() {
  return (
    <footer className="w-full py-8">
      {/* MOBILE */}
      <div className="md:hidden flex justify-center">
        <p className="text-[11px] text-neutral-400 tracking-wide hover:text-neutral-700 transition-colors">
          Ingridpumayalla.com · © 2026 · Site by NinanStudio
        </p>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block md:pl-[100px] lg:pl-[120px]">
        <p className="text-center text-[11px] text-neutral-400 tracking-wide hover:text-neutral-700 transition-colors">
          Ingridpumayalla.com · © 2026 · Site by NinanStudio
        </p>
      </div>
    </footer>
  );
}