import { pages } from "../../../data/pages";

export default function Contact({ params }) {
  const lang = params.lang;
  const contact = pages.contact;

  return (
    <div className="mt-16">
      <h1 className="text-2xl font-normal tracking-[0.15em] mb-12">
        {contact.title[lang]}
      </h1>

      <p className="text-xs text-neutral-500 mb-6">
        {contact.text[lang]}
      </p>

      <a
        href={`mailto:${contact.email}`}
        className="text-xs text-neutral-600 tracking-wide transition-opacity hover:opacity-70"
      >
        {contact.email}
      </a>
    </div>
  );
}