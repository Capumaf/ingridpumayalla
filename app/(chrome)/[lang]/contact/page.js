import { pages } from "../../../data/pages";

export default async function Contact({ params }) {
  const { lang } = await params;
  const contact = pages.contact;

  return (
    <div className="mt-16 max-w-sm">
      <h1 className="mb-12 text-2xl font-normal tracking-[0.15em]">
        {contact.title[lang]}
      </h1>

      <p className="mb-10 text-[15px] leading-7 text-neutral-600">
        {contact.text[lang]}
      </p>

      <div className="space-y-4">
        {/* Email */}
        <a
          href={`mailto:${contact.email}`}
          className="block text-xs tracking-[0.18em] text-neutral-800 hover:opacity-60 transition"
        >
          {contact.email}
        </a>

        {/* Instagram (desde el CV) */}
        <a
          href="https://instagram.com/ingridjosefa"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs tracking-[0.18em] text-neutral-500 hover:opacity-60 transition"
        >
          @ingridjosefa
        </a>
      </div>
    </div>
  );
}