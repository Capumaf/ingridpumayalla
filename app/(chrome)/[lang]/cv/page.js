"use client";

import { useEffect, useState } from "react";
import { pages } from "@/data/pages";

const cvContent = {
  en: [
    {
      title: "Education",
      items: [
        "MA Fine Arts | 2013–2015 | Central Saint Martins School of Arts and Design — London, UK.",
        "BA Photography | 2009–2012 | Instituto Centro de la Imagen — Lima, Peru.",
      ],
    },
    {
      title: "Awards · Grants",
      items: [
        "Daniel Ford International Prize — MA Fine Arts, 2015, UK.",
        "R C Sherriff Trust — Elmbridge, 2018, UK.",
        "Grant Recipient, Ministry of Culture of Peru — Huaca Viva, Solo Exhibition, Trujillo, Peru. Recipient of a 2026 Ministry of Culture of Peru grant supporting the production and presentation of Huaca Viva.",
      ],
    },
    {
      title: "Residencies",
      items: [
        "2025 | Chain in Reaction, Lisbon, Portugal.",
        "2023 | Sidney Nolan Trust | UK.",
        "2019 | Pilotenkuche Arts Residency, Leipzig, Germany.",
        "2019 | Stokkøya Collaborative Arts Program, Norway.",
        "2016 | Wilderness Amargos Residency, Greece.",
      ],
    },
    {
      title: "Solo Exhibitions",
      items: [
        "2026 — Huaca Viva, Museum of Modern Art of Trujillo, Peru. (Upcoming).",
        "2022 — Where Did the Creatures from the Forest Go?, Museo de Arte de San Marcos, Lima, Peru.",
        "2021 — Cantos Matrios, Paijan Gallery, Trujillo, Peru.",
        "2020 — Nuna, the Exercise to Climb a Tree, ABRIR Gallery, Online Exhibition.",
      ],
    },
    {
      title: "Group Exhibitions / Film Screenings",
      items: [
        "2026 — 8 Formas de Curar una Herida, 8M Cine Chimú Program, Trujillo, Peru.",
        "2025 — Loopend, Ostra, Lisbon, Portugal.",
        "2025 — Interweaving Climate, Water(s) and Communities, ExposeArtProjects, London, UK.",
        "2025 — The Earth: An Uncertain Future, Institute of the Arts, Havana Biennial, Cuba.",
        "2024 — Yo elijo lo que creo, IESA International, France.",
        "2024 — APUK1, Peruvian Artists in the UK, British Peruvian Institute, Lima, Peru.",
        "2023 — Plant Comunitas, Sidney Nolan Trust, UK.",
        "2022 — Plant Comunitas, Museum in the Park, Stroud, UK.",
        "2022 — FilmWater, Art House Jersey, Jersey, UK.",
        "2021 — Taki Pupu, Contemporary Visual Art Prize, Peruvian American Institute, Lima, Peru. Shortlisted.",
        "2021 — Ai Miz Yu | The Others, Turin, Italy.",
        "2021 — Museum in Residency, Southwark Cathedral, London, UK.",
        "2021 — Cuerpo Multiplicado Female Voices of LatinoAmerica, Vortic Online, UK.",
        "2020 — Nostalgias Imperiales, Pasaporte para un Artista, Alianza Francesa, Peru.",
        "2020 — Incendiary, Pound Arts Centre, Corsham, UK.",
        "2020 — Today, Abrir Galeria, Online Exhibition.",
        "2020 — Espasmos Colectivos, Armarios y Vitrina, Facultad de Bellas Artes de la Universidad Complutense, Madrid, Spain.",
        "2019 — Overwhelmed Incorporeal Happiness, Pilotenkuche, Leipzig, Germany.",
        "2019 — Lichtspiel des Westens, Curiwarmi, Karl Heine, Leipzig, Germany.",
        "2019 — Reset Unsettled Flesh Layers, Alte Handelsschule, Leipzig, Germany.",
        "2019 — Excerpt Cantos al Agua, PK TV Screening, Open Design Fair, Leipzig, Germany.",
        "2019 — On Precarious Ground, Bygda 2.0, Stokkøya, Norway.",
        "2019 — Cantos al Agua, Film Screening Until You Become Me, The Old Mill, London, UK.",
        "2019 — A Field Guide to Getting Lost Vol. 2, Anesis Cinema, Aegina, Greece.",
        "2019 — Otras Madres, Film Screening, The Laundry — A Space for Change, UNESCO International Mother Language Film Program, London, UK.",
        "2019 — Otras Madres, Film Screening, 13th Native Spirit Indigenous Film Festival, Senate House, London, UK.",
        "2019 — Solace Project Exhibition, Windows Gallery, Central Saint Martins, London, UK.",
        "2018 — Otras Madres. Identity. Intersectionality. Indigeneity, Xart Splitta, Berlin, Germany.",
        "2018 — Yuraj Warmi, Illari, 12th Native Spirit Indigenous Film Festival, Senate House Library, London, UK.",
        "2018 — Singing to My Grandmother, ArtLacuna, London, UK.",
        "2018 — Icaro para Curar, Bow Arts Studios, London, UK.",
        "2017 — Yana Warmi, Yuraj Warmi, The Old Library, London, UK.",
        "2017 — Inhabit in the Shadow, We Are Lumberjack, London, UK.",
        "2017 — One Summer Night, The Crypt Gallery, London, UK.",
        "2017 — The Place in the End, TAF, Athens, Greece.",
        "2017 — Buscando el Icaro Interior, South London Gallery, London, UK.",
        "2016 — We Are Always Several at Once, Safehouse 1, London, UK.",
        "2015 — Aestivation Collective, Elthorne Rd Studios, London, UK.",
      ],
    },
  ],

  es: [
    {
      title: "Educación",
      items: [
        "MA Fine Arts | 2013–2015 | Central Saint Martins School of Arts and Design — Londres, Reino Unido.",
        "BA Fotografía | 2009–2012 | Instituto Centro de la Imagen — Lima, Perú.",
      ],
    },
    {
      title: "Premios · Becas",
      items: [
        "Daniel Ford International Prize — MA Fine Arts, 2015, Reino Unido.",
        "R C Sherriff Trust — Elmbridge, 2018, Reino Unido.",
        "Becaria del Ministerio de Cultura del Perú — Huaca Viva, exposición individual, Trujillo, Perú. Beneficiaria de una beca 2026 del Ministerio de Cultura del Perú que respalda la producción y presentación de Huaca Viva.",
      ],
    },
    {
      title: "Residencias",
      items: [
        "2025 | Chain in Reaction, Lisbon, Portugal.",
        "2023 | Sidney Nolan Trust | Reino Unido.",
        "2019 | Pilotenkuche Arts Residency, Leipzig, Alemania.",
        "2019 | Stokkøya Collaborative Arts Program, Noruega.",
        "2016 | Wilderness Amargos Residency, Grecia.",
      ],
    },
    {
      title: "Exposiciones individuales",
      items: [
        "2026 — Huaca Viva, Museo de Arte Moderno de Trujillo, Perú. (Próximamente).",
        "2022 — Where Did the Creatures from the Forest Go?, Museo de Arte de San Marcos, Lima, Perú.",
        "2021 — Cantos Matrios, Paijan Gallery, Trujillo, Perú.",
        "2020 — Nuna, the Exercise to Climb a Tree, ABRIR Gallery, exposición online.",
      ],
    },
    {
      title: "Exposiciones colectivas / Proyecciones",
      items: [
        "2026 — 8 Formas de Curar una Herida, Programa 8M Cine Chimú, Trujillo, Perú.",
        "2025 — Loopend, Ostra, Lisboa, Portugal.",
        "2025 — Interweaving Climate, Water(s) and Communities, ExposeArtProjects, Londres, Reino Unido.",
        "2025 — The Earth: An Uncertain Future, Institute of the Arts, Bienal de La Habana, Cuba.",
        "2024 — Yo elijo lo que creo, IESA International, Francia.",
        "2024 — APUK1, Peruvian Artists in the UK, Instituto Cultural Peruano Británico, Lima, Perú.",
        "2023 — Plant Comunitas, Sidney Nolan Trust, Reino Unido.",
        "2022 — Plant Comunitas, Museum in the Park, Stroud, Reino Unido.",
        "2022 — FilmWater, Art House Jersey, Jersey, Reino Unido.",
        "2021 — Taki Pupu, Premio de Arte Visual Contemporáneo, Instituto Cultural Peruano Norteamericano, Lima, Perú. Finalista.",
        "2021 — Ai Miz Yu | The Others, Turín, Italia.",
        "2021 — Museum in Residency, Southwark Cathedral, Londres, Reino Unido.",
        "2021 — Cuerpo Multiplicado Female Voices of LatinoAmerica, Vortic Online, Reino Unido.",
        "2020 — Nostalgias Imperiales, Pasaporte para un Artista, Alianza Francesa, Perú.",
        "2020 — Incendiary, Pound Arts Centre, Corsham, Reino Unido.",
        "2020 — Today, Abrir Galeria, exposición online.",
        "2020 — Espasmos Colectivos, Armarios y Vitrina, Facultad de Bellas Artes de la Universidad Complutense, Madrid, España.",
        "2019 — Overwhelmed Incorporeal Happiness, Pilotenkuche, Leipzig, Alemania.",
        "2019 — Lichtspiel des Westens, Curiwarmi, Karl Heine, Leipzig, Alemania.",
        "2019 — Reset Unsettled Flesh Layers, Alte Handelsschule, Leipzig, Alemania.",
        "2019 — Excerpt Cantos al Agua, PK TV Screening, Open Design Fair, Leipzig, Alemania.",
        "2019 — On Precarious Ground, Bygda 2.0, Stokkøya, Noruega.",
        "2019 — Cantos al Agua, Film Screening Until You Become Me, The Old Mill, Londres, Reino Unido.",
        "2019 — A Field Guide to Getting Lost Vol. 2, Anesis Cinema, Aegina, Grecia.",
        "2019 — Otras Madres, Film Screening, The Laundry — A Space for Change, UNESCO International Mother Language Film Program, Londres, Reino Unido.",
        "2019 — Otras Madres, Film Screening, 13th Native Spirit Indigenous Film Festival, Senate House, Londres, Reino Unido.",
        "2019 — Solace Project Exhibition, Windows Gallery, Central Saint Martins, Londres, Reino Unido.",
        "2018 — Otras Madres. Identity. Intersectionality. Indigeneity, Xart Splitta, Berlín, Alemania.",
        "2018 — Yuraj Warmi, Illari, 12th Native Spirit Indigenous Film Festival, Senate House Library, Londres, Reino Unido.",
        "2018 — Singing to My Grandmother, ArtLacuna, Londres, Reino Unido.",
        "2018 — Icaro para Curar, Bow Arts Studios, Londres, Reino Unido.",
        "2017 — Yana Warmi, Yuraj Warmi, The Old Library, Londres, Reino Unido.",
        "2017 — Inhabit in the Shadow, We Are Lumberjack, Londres, Reino Unido.",
        "2017 — One Summer Night, The Crypt Gallery, Londres, Reino Unido.",
        "2017 — The Place in the End, TAF, Atenas, Grecia.",
        "2017 — Buscando el Icaro Interior, South London Gallery, Londres, Reino Unido.",
        "2016 — We Are Always Several at Once, Safehouse 1, Londres, Reino Unido.",
        "2015 — Aestivation Collective, Elthorne Rd Studios, Londres, Reino Unido.",
      ],
    },
  ],
};

export default function CV({ params }) {
  const { lang } = params;

  const { title, downloadLabel, downloadHref } = pages.cv;

  const currentLang = lang === "es" ? "es" : "en";
  const cvSections = cvContent[currentLang];

  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      <article className="pt-14 md:pt-16">
        <div className="px-6 md:px-0 max-w-[820px] mx-auto">
          <header className="mb-16">
            <p className="mb-4 text-[11px] uppercase tracking-[0.24em] text-neutral-400">
              Curriculum Vitae
            </p>
          </header>

          <div className="space-y-16 md:space-y-20">
            {cvSections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-8 text-[13px] md:text-[15px] uppercase tracking-[0.42em] font-medium text-black">
                  {section.title}
                </h2>

                <div className="space-y-3">
                  {section.items.map((item) => (
                    <p
                      key={item}
                      className="text-[13.5px] md:text-[14px] leading-[1.85] text-neutral-700"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="pt-8 md:pt-12">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 transition-colors hover:text-[#b7623b]"
            >
              {downloadLabel[currentLang]} →
            </button>
          </div>
        </div>
      </article>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/80 px-8 py-12 backdrop-blur-md">
          <a
            href={downloadHref}
            download
            className="absolute left-6 top-6 text-[11px] tracking-[0.25em] text-white/70 transition hover:text-white"
          >
            {currentLang === "es" ? "DESCARGAR" : "DOWNLOAD"}
          </a>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-6 top-6 text-lg text-white/70 transition hover:text-white"
            aria-label="Close CV preview"
          >
            ×
          </button>

          <div className="h-[92vh] w-[90vw] max-w-5xl shadow-2xl">
            <iframe
              src={downloadHref}
              title={title[currentLang]}
              className="h-full w-full border-0"
            />
          </div>
        </div>
      )}
    </>
  );
}