import { pages } from "../../../data/pages";

export default async function Contact({ params }) {
  const { lang } = await params;
  const contact = pages.contact;

  const labels = {
    en: {
      section: "Contact",
      email: "Email",
      instagram: "Instagram",
    },

    es: {
      section: "Contacto",
      email: "Correo",
      instagram: "Instagram",
    },
  };

  const t = labels[lang] || labels.en;

  return (
    <article className="pt-14 md:pt-16">
      <div className="px-6 md:px-0 max-w-[820px] mx-auto">
        <header className="mb-14">
          <p className="mb-4 text-[11px] uppercase tracking-[0.24em] text-neutral-400">
            {t.section}
          </p>

          <p className="max-w-[520px] text-[13.5px] leading-[1.9] text-neutral-600">
            {contact.text[lang]}
          </p>
        </header>

        <section className="border-y border-black/10 py-8 md:py-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start md:gap-14">
            {/* EMAIL */}
            <a
              href={`mailto:${contact.email}`}
              className="group flex flex-col gap-2 text-neutral-800 transition hover:opacity-60"
            >
              <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                {t.email}
              </span>

              <span className="text-[13px] tracking-[0.04em] whitespace-nowrap">
                {contact.email}
              </span>
            </a>

            {/* INSTAGRAM */}
            <a
              href="https://instagram.com/ingridjosefa"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2 text-neutral-800 transition hover:opacity-60"
            >
              <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                {t.instagram}
              </span>

              <span className="text-[13px] tracking-[0.08em]">
                @ingridjosefa
              </span>
            </a>
          </div>
        </section>
      </div>
    </article>
  );
}