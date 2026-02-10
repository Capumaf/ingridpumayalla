export const projectDetails = {
  /* -------------------------------------------------- */
  /* ¿A DÓNDE FUERON LAS CRIATURAS DEL BOSQUE? */
  /* -------------------------------------------------- */
  "criaturas-del-bosque": {
    title: {
      es: "¿A dónde fueron las criaturas del bosque?",
      en: "Where Did the Forest Creatures Go?",
    },

    introduction: {
      es: `Sobre ¿A dónde fueron las criaturas del bosque?

En un sueño provocado por la ingestión de ayahuasca, Ingrid recibió la visita de la abuela del Amazonas. Se le apareció en forma de cantos y súplicas contra el olvido. “Vuelve, mi pequeña niña dorada”, canta. “Te envié mariposas para protegerte, y eso no te bastó”.

Después de que la noche pasara, Ingrid sintió un nudo en la garganta, removida por la incertidumbre en torno al destino de la Abuela Amazonas. Días después, y lejos del Perú, Ingrid observa videos del Amazonas consumido por las llamas. Para finales de 2019, vastos territorios habían sido devastados y destruidos por incendios masivos en Brasil, Bolivia y Perú.

Curiwarmi, que en quechua significa “mujer dorada”, es la protagonista de esta historia de ciencia ficción extrañamente real. En este relato de migración climática, el espíritu del bosque la salva de los incendios del Amazonas de 2019.

En Alemania emerge del lago Markkleeberger, antiguamente una mina de carbón. En Inglaterra visita el Westbury White Horse. En Pucallpa y Contumazá escucha relatos sobre textiles y realiza sesiones colaborativas de tejido.

La historia de Curiwarmi nos recuerda que recalibrar nuestra relación con la naturaleza es una tarea lenta. Este proyecto fue presentado como exposición individual en el Museo de San Marcos, Lima, en 2022. Curaduría: Gisselle Girón Casas.`,
      en: `About Where Did the Forest Creatures Go?

In a dream brought about by ayahuasca, Ingrid received a visit from the grandmother of the Amazon, appearing as songs and pleas against oblivion.

After the night had passed, Ingrid felt uncertainty surrounding the fate of Grandma Amazonas. Days later, far from Peru, she watched videos of the Amazon consumed by flames.

Curiwarmi, meaning “golden woman” in Quechua, is the protagonist of this strangely real science fiction story. In this tale of climate migration, the spirit of the forest saves her from the 2019 fires.

In Germany she emerges from Markkleeberger Lake. In England she visits the Westbury White Horse. In Pucallpa and Contumazá she participates in collaborative weaving sessions.

Curiwarmi’s story reminds us that recalibrating our relationship with nature is a slow journey. This multimedia project was presented as a solo exhibition in Lima in 2022. Curated by Gisselle Girón Casas.`,
    },

    // Mobile: grande pero proporcional (no full width)
    coverDisplay: { maxWidth: 560, maxHeightVh: 72 },

    images: [{ src: "/Bosque.webp", width: 760, height: 500 }],

    imageData: [
      {
        id: "img1",
        src: "/Bosque.webp",
        description: { es: "Bosque silencioso, 2019.", en: "Silent forest, 2019." },
        width: 1200,
        height: 1000,
      },
      {
        id: "img2",
        src: "/Bosque2.webp",
        description: {
          es: "Presencias invisibles entre árboles.",
          en: "Invisible presences among the trees.",
        },
        width: 740,
        height: 480,
      },
      {
        id: "img3",
        src: "/Bosque3.webp",
        description: {
          es: "Presencias invisibles entre árboles.",
          en: "Invisible presences among the trees.",
        },
        width: 740,
        height: 480,
      },
    ],

    videoClips: [
      { src: "/Video.mp4", start: 122, end: 132 },
      { src: "/Video.mp4", start: 804, end: 814 },
    ],
  },

  /* -------------------------------------------------- */
  /* CURIWARMI LUNAR */
  /* -------------------------------------------------- */
  "curiwarmi-lunar": {
    title: { es: "Curiwarmi Lunar", en: "Curiwarmi Lunar" },

    introduction: {
      es: "Serie visual que evoca la espiritualidad andina femenina.",
      en: "A visual series evoking Andean feminine spirituality.",
    },

    // Vertical: menos ancho, más altura (ideal para PNG también)
    coverDisplay: { maxWidth: 460, maxHeightVh: 80 },

    imageData: [
      // OJO: en Vercel el nombre debe coincidir EXACTO (mayúsculas/minúsculas)
      { id: "img1", src: "/Curiwarmi_Lunar.png", width: 600, height: 800 },
      { id: "img2", src: "/CuriwarmiLunar2.png", width: 600, height: 800 },
      { id: "img3", src: "/Curiwarmilunar3.png", width: 600, height: 800 },
      {
        id: "img4",
        src: "/Instalacion2024.webp",
        width: 600,
        height: 800,
        onlyViewer: true,
      },
    ],
  },

  /* -------------------------------------------------- */
  /* CANTOS MATRIOS */
  /* -------------------------------------------------- */
  "cantos-matrios": {
    title: { es: "Cantos Matrios", en: "Cantos Matrios" },

    introduction: {
      es: "Exploración poética del sonido y la voz.",
      en: "A poetic exploration of sound and voice.",
    },

    coverDisplay: { maxWidth: 600, maxHeightVh: 70 },

    images: [{ src: "/Cantos6.webp", width: 1000, height: 600 }],

    imageData: [
      { id: "img1", src: "/Cantos6.webp", width: 1000, height: 600 },
      { id: "img2", src: "/Cantos2.webp", width: 1000, height: 600 },
      { id: "img3", src: "/Cantos3.webp", width: 1000, height: 600 },
      { id: "img4", src: "/Cantos4.webp", width: 1000, height: 600 },
      {
        id: "img5",
        src: "/Cantos1.webp",
        width: 1000,
        height: 600,
        audio: "/Audio7.mp3",
      },
    ],
  },

  /* -------------------------------------------------- */
  /* GIVING BIRTH TO A POMADEGRANADE */
  /* -------------------------------------------------- */
  "giving-birth-to-a-pomadegranade": {
    title: {
      es: "Dar a luz a una granada",
      en: "Giving Birth to a Pomadegranade",
    },

    introduction: {
      es: "Serie sobre el nacimiento simbólico.",
      en: "A series on symbolic birth.",
    },

    // Primera imagen vertical-ish → más altura
    coverDisplay: { maxWidth: 480, maxHeightVh: 78 },

    imageData: [
      { id: "img1", src: "/pomade5.webp", width: 500, height: 700 },
      { id: "img2", src: "/pomade1.webp", width: 800, height: 700 },
      { id: "img3", src: "/pomade3.webp", width: 1000, height: 700 },
      { id: "img4", src: "/pomade4.webp", width: 1000, height: 700 },
      { id: "img5", src: "/pomade2.webp", width: 1000, height: 700 },
    ],
  },

  /* -------------------------------------------------- */
  /* TAKIJ PUPU */
  /* -------------------------------------------------- */
  "takij-pupu": {
    title: { es: "Takij Pupu", en: "Takij Pupu" },

    images: [{ src: "/TakijPupu.webp", width: 900, height: 600 }],

    coverDisplay: { maxWidth: 420, maxHeightVh: 62 },

    imageData: [
      { id: "img1", src: "/TakijPupu.webp", width: 900, height: 600 },
    ],
  },

  /* -------------------------------------------------- */
  /* OBRAS SIN IMÁGENES (LISTAS PARA EL FUTURO) */
  /* -------------------------------------------------- */
  "nostalgias-imperiales": {
    title: { es: "Nostalgias Imperiales", en: "Imperial Nostalgias" },
    description: {
      es: "Proyecto sobre memoria y desplazamiento.",
      en: "A project about memory and displacement.",
    },
    coverDisplay: { maxWidth: 520, maxHeightVh: 72 },
  },

  "la-quinta-piedra": {
    title: { es: "La Quinta Piedra", en: "The Fifth Stone" },
    coverDisplay: { maxWidth: 520, maxHeightVh: 72 },
  },

  ofrendas: {
    title: { es: "Ofrendas", en: "Offerings" },
    coverDisplay: { maxWidth: 520, maxHeightVh: 72 },
  },
};
