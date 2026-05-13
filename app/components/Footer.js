export default function Footer() {
  return (
    <footer className="w-full py-8">
      <div
        className="
          ml-[240px]
          w-[calc(100%-300px)]
          flex
          justify-center
        "
      >
        <p
          className="
            text-[11px]
            text-neutral-400
            tracking-wide
            hover:text-neutral-700
            transition-colors
          "
        >
          Ingridpumayalla.com · © 2026 · Site by NinanStudio
        </p>
      </div>
    </footer>
  );
}