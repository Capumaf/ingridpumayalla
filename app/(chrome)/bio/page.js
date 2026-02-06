"use client";

import { useState } from "react";
import Image from "next/image";

export default function Bio() {
  const [isSpanish, setIsSpanish] = useState(false);

  return (
    <article className="mt-40">
      {/* Wrapper general de página */}
      <div className="mx-auto max-w-3xl px-6">
        {/* Toggle idioma (sutil editorial) */}
        <button
          className="mb-12 text-xs tracking-widest text-neutral-500 hover:text-black transition-colors"
          onClick={() => setIsSpanish((v) => !v)}
        >
          {isSpanish ? "EN" : "ES"}
        </button>

        {!isSpanish ? (
          <>
            {/* ENGLISH */}
            <div className="body-text">
              <h1 className="text-2xl mb-10 text-black">Biography</h1>

              <p className="mb-6">
                Ingrid Pumayalla (Trujillo, 1989) holds a BA in Photography from the
                Centro de la Imagen Institute, Lima (2012). She earned her MA in Fine
                Arts from Central Saint Martins, London, in 2015, where she was
                awarded the Daniel Ford International Prize.
              </p>

              <p className="mb-6">
                Pumayalla’s moving image and performance work have been exhibited
                internationally. She has participated in artist residencies,
                including Stokkøya Collaborative Residency in Norway (2019),
                Pilotenkueche International Arts Program in Leipzig, Germany (2019),
                Vera Mirodes Studio in Lisbon, Portugal (2023), and the Sidney Nolan
                Trust in the UK (2023).
              </p>

              <p className="mb-6">
                In early 2024, she collaborated with the IESA International
                Institute in Paris for a duo exhibition with Peruvian artist Les
                Egusquiza. Previously, she served as a photography lecturer at the
                Universidad Privada del Norte in Trujillo, Peru, from 2019 to 2021.
              </p>

              <p className="mb-6">
                Her project <em>Matoaka is My Name, Matoaka es Mi Nombre</em> was
                shortlisted for the Contemporary Arts Prize from the American
                Peruvian Institute (2022). Her photographic installation{" "}
                <em>Rastreando</em> was featured in the exhibition{" "}
                <em>Hilos que Resisten, Hilos que Subvierten</em>, curated by
                Gabriela Germaná at the Peruvian British Institute in Lima (2022).
                Pumayalla&apos;s first solo exhibition was held at the Museum of San
                Marcos, Lima (2022).
              </p>

              <p className="mb-10">
                Her film <em>Where Did the Creatures from the Forest Go?</em> will
                be featured in the exhibition <em>Tierra: Un Futuro Incierto</em> at
                the Art Institute of La Habana as part of the 15th Biennale of
                Havana, Cuba, in January 2025.
              </p>
            </div>

            {/* Image + caption (fuera de body-text) */}
            <figure className="my-12">
              <div className="flex justify-start">
                <Image
                  src="/SelfportraitWithHugstone.webp"
                  alt="Selfportrait with Hugstone"
                  width={720}
                  height={480}
                  className="rounded-lg"
                />
              </div>
              <figcaption className="mt-3 text-xs tracking-wide text-neutral-500">
                Selfportrait with Hugstone, 2018.
              </figcaption>
            </figure>

            {/* Statement */}
            <div className="body-text">
              <h2 className="text-2xl mb-10 text-black">Statement</h2>

              <p className="mb-6">
                My journey as an artist has been deeply shaped by my migration to
                the UK, which expanded my understanding of displacement and
                intersected with my reflections on the violent civil war in Peru.
                My practice began with archiving the work of German-Peruvian
                photographer Vera Lentz, who documented the trauma of Peru’s civil
                conflict.
              </p>

              <p className="mb-6">
                This early experience informed subsequent projects such as{" "}
                <em>Otras Madres</em> (2017), my first documentary exploring the
                displacement of Quechua women, and{" "}
                <em>Where Did the Creatures from the Forest Go?</em> (2019), a mythic
                response to the Amazon rainforest fires that examines environmental
                destruction and cultural resilience.
              </p>

              <p className="mb-6">
                In addition to my creative work, I have contributed to collaborative
                research projects, such as assisting Bolivian-English photographer
                Nick Ballon in his exploration of Mancio Sierra de Leguizamón, a
                16th-century conquistador who acknowledged the violence inflicted on
                the Quechua people and the significance of Incan culture. This
                intersection of history, memory, and cultural legacy continues to
                inspire my approach to art.
              </p>

              <p className="mb-6">
                Over the last seven years, I have balanced my practice with part-time
                work to sustain my life and studio in London. However, I now feel
                ready to fully dedicate myself to research and creative development
                through studentship opportunities. This project represents a vital
                opportunity to expand my knowledge, contribute to academic discourse,
                and foster cultural exchanges between Peru and the UK. By addressing
                the history of violence in Peru and its post-armed conflict legacies,
                I aim to create work that not only heals but also generates meaningful
                dialogue about cultural memory, resilience, and justice.
              </p>

              <p className="mb-6">
                Given the current political climate in Peru, where governmental
                support for post-conflict projects has diminished, external support
                and global engagement are crucial to ensuring these narratives are
                explored and preserved. This studentship will empower me to develop a
                theoretical foundation for my work and contribute to the broader
                effort of repairing and understanding Peru&apos;s history of violence.
              </p>

              <p className="mb-6">
                The philosophy of the Quintin Hogg Trust and this Studentship resonates
                deeply with the interdisciplinary and practice-based approach of my
                research. Rooted in the exploration of inherited trauma, collective
                memory, and cultural resilience, my project draws on both traditional
                scholarship and innovative methodologies to address critical questions
                about the legacy of violence in Peru and the role of art in fostering
                healing and dialogue.
              </p>

              <p className="mb-2">
                At the heart of my work is the fusion of craftsmanship, storytelling,
                and academic inquiry. My project weaves together Quechua oral histories,
                Andean cosmology, and site-specific art practices to create a non-fiction
                film and performances that act as living archives of memory and resilience.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* ESPAÑOL */}
            <div className="body-text">
              <h1 className="text-2xl mb-10 text-black">Biografía</h1>

              <p className="mb-6">
                Ingrid Pumayalla (Trujillo, 1989) es licenciada en Fotografía por el
                Instituto Centro de la Imagen, Lima (2012). Posteriormente obtuvo una
                Maestría en Bellas Artes en Central Saint Martins, Londres (2015),
                donde fue distinguida con el Premio Internacional Daniel Ford.
              </p>

              <p className="mb-6">
                Su práctica en imagen en movimiento y performance ha sido exhibida
                internacionalmente. Ha participado en diversas residencias artísticas,
                entre ellas Stokkøya Collaborative Residency en Noruega (2019),
                Pilotenkueche International Art Program en Leipzig, Alemania (2019),
                Vera Mirodes Studio en Lisboa, Portugal (2023), y el Sidney Nolan Trust
                en el Reino Unido (2023).
              </p>

              <p className="mb-6">
                En 2024 colaboró con el IESA International Institute en París en una
                exposición a dúo junto al artista peruano Les Egusquiza. Anteriormente,
                se desempeñó como docente de fotografía en la Universidad Privada del
                Norte, en Trujillo, Perú, entre 2019 y 2021.
              </p>

              <p className="mb-6">
                Su proyecto <em>Matoaka is My Name, Matoaka es Mi Nombre</em> fue
                seleccionado en la lista corta del Premio de Artes Contemporáneas del
                Instituto Peruano Americano (2022). Su instalación fotográfica{" "}
                <em>Rastreando</em> formó parte de la exposición{" "}
                <em>Hilos que Resisten, Hilos que Subvierten</em>, curada por Gabriela
                Germaná en el Instituto Cultural Peruano Británico de Lima (2022). Su
                primera exposición individual se realizó en el Museo de San Marcos,
                Lima (2022).
              </p>

              <p className="mb-10">
                Su película <em>Where Did the Creatures from the Forest Go?</em>{" "}
                formará parte de la exposición <em>Tierra: Un Futuro Incierto</em> en el
                Instituto de Arte de La Habana, como parte de la 15ª Bienal de La Habana,
                en enero de 2025.
              </p>
            </div>

            {/* Image + caption */}
            <figure className="my-12">
              <div className="flex justify-start">
                <Image
                  src="/SelfportraitWithHugstone.jpg"
                  alt="Autorretrato con Hugstone"
                  width={720}
                  height={480}
                  className="rounded-lg"
                />
              </div>
              <figcaption className="mt-3 text-xs tracking-wide text-neutral-500">
                Autorretrato con Hugstone, 2018.
              </figcaption>
            </figure>

            <div className="body-text">
              <h2 className="text-2xl mb-10 text-black">Declaración</h2>

              <p className="mb-6">
                Mi trayectoria artística ha estado profundamente marcada por mi
                experiencia migratoria en el Reino Unido, la cual amplió mi comprensión
                del desplazamiento y se entrelazó con mis reflexiones en torno al
                conflicto armado interno en el Perú. Mi práctica se inició a partir del
                trabajo de archivo de la fotógrafa germano-peruana Vera Lentz, quien
                documentó el trauma social producido por la violencia política en el país.
              </p>

              <p className="mb-6">
                Esta experiencia temprana influyó en proyectos posteriores como{" "}
                <em>Otras Madres</em> (2017), mi primer documental sobre el desplazamiento
                de mujeres quechuas, y <em>Where Did the Creatures from the Forest Go?</em>{" "}
                (2019), una respuesta de carácter mítico a los incendios en la Amazonía
                que aborda la destrucción ambiental y la resiliencia cultural.
              </p>

              <p className="mb-6">
                Paralelamente a mi producción artística, he participado en proyectos de
                investigación colaborativa, como la asistencia al fotógrafo
                boliviano-británico Nick Ballon en su estudio sobre Mancio Sierra de
                Leguizamón, conquistador del siglo XVI que reconoció la violencia
                ejercida contra los pueblos quechuas y la importancia de la cultura
                incaica. Esta intersección entre historia, memoria y legado cultural
                continúa influyendo de manera decisiva en mi práctica artística.
              </p>

              <p className="mb-6">
                Durante los últimos siete años he sostenido mi trabajo creativo mediante
                empleos a tiempo parcial, con el fin de mantener mi vida y estudio en
                Londres. En este momento, me encuentro preparada para dedicarme plenamente
                a la investigación y al desarrollo creativo a través de programas de
                formación doctoral. Este proyecto representa una oportunidad fundamental
                para profundizar en el conocimiento teórico, contribuir al debate académico
                y fomentar intercambios culturales entre el Perú y el Reino Unido.
              </p>

              <p className="mb-6">
                En el contexto político actual del Perú, donde el apoyo estatal a proyectos
                vinculados a la memoria y al posconflicto se ha visto considerablemente
                reducido, el respaldo externo y la proyección internacional resultan
                esenciales para garantizar que estas narrativas sean investigadas,
                preservadas y compartidas. Este proceso de investigación busca contribuir
                a la comprensión crítica del pasado violento del país y a la construcción
                de espacios de reparación simbólica.
              </p>

              <p className="mb-6">
                El enfoque interdisciplinario y basado en la práctica que promueve la
                filosofía del Quintin Hogg Trust y de esta beca dialoga profundamente con
                mi investigación. Mi trabajo se centra en la exploración del trauma
                heredado, la memoria colectiva y la resiliencia cultural, integrando
                metodologías académicas con prácticas artísticas experimentales.
              </p>

              <p className="mb-2">
                En el núcleo de mi práctica se encuentra la convergencia entre artesanía,
                narración y reflexión académica. A través de la integración de relatos
                orales quechuas, la cosmología andina y prácticas artísticas situadas,
                desarrollo películas de no ficción y performances concebidas como archivos
                vivos de memoria y resistencia.
              </p>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
