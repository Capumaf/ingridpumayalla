import Image from "next/image";

export default function HomePage() {
  return (
    <div className="w-full max-w-[550px] px-6">
      <div className="relative w-full aspect-[3/4]">
        <Image
          src="/curiwarmiLunar2.png"
          alt=""
          fill
          priority
          className="object-contain scale-90"
        />
      </div>
    </div>
  );
}
