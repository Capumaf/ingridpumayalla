"use client";

import Link from "next/link";

const projects = [
  { id: "criaturas-del-bosque", title: "¿A dónde fueron las criaturas del bosque?" },
  { id: "curiwarmi-lunar", title: "Curiwarmi Lunar" },
  { id: "cantos-matrios", title: "Cantos Matrios" },
  { id: "takij-pupu", title: "Takij Pupu" },
  { id: "nostalgias-imperiales", title: "Nostalgias Imperiales" },
  { id: "la-quinta-piedra", title: "La Quinta Piedra" },
  { id: "ofrendas", title: "Ofrendas" },
  { id: "giving-birth-to-a-pomadegranade", title: "Giving birth to a pomadegranade" },
];

export default function Works() {
  return (
    <div className="flex flex-col mt-40">
      <h1 className="text-2xl mb-10">Works</h1>

      <ul className="space-y-3">
        {projects.map(({ id, title }) => (
          <li key={id}>
            <Link
              href={`/works/${id}`}
              className="text-black tracking-wide transition-opacity hover:opacity-70"
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
