import { pages } from "../../../data/pages";

export default function Contact({ params }) {
  const lang = params.lang;

  const contact = pages.contact;

  return (
    <div className="mt-40">
      <h1 className="text-2xl mb-10">
        {contact.title[lang]}
      </h1>

      <p className="text-neutral-500 mb-6">
        {contact.text[lang]}
      </p>

      <a
        href={`mailto:${contact.email}`}
        className="text-black tracking-wide transition-opacity hover:opacity-70"
      >
        {contact.email}
      </a>
    </div>
  );
}