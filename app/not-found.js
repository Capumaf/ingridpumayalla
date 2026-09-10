import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-2xl font-normal tracking-[0.15em] mb-6">404</h1>

        <p className="text-xs text-neutral-600 tracking-widest mb-1">
          Página no encontrada
        </p>
        <p className="text-xs text-neutral-600 tracking-widest mb-10">
          Page not found
        </p>

        <div className="flex flex-col items-center gap-3">
          <Link
            href="/es/home"
            className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b] transition-colors"
          >
            Volver al inicio →
          </Link>
          <Link
            href="/en/home"
            className="text-xs tracking-widest text-gray-500 hover:text-[#b7623b] transition-colors"
          >
            Back to home →
          </Link>
        </div>
      </div>
    </div>
  );
}
