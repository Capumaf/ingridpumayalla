import Image from "next/image";

export default async function HomePage({ params }) {
  const { lang } = await params;

  return (
    <div className="w-full flex justify-center items-center h-full">
      
      <div className="w-full max-w-[600px] px-6 md:px-0">
        
        <div className="relative w-full aspect-[3/4] max-h-[75vh] mx-auto">
          <Image
            src="/curiwarmiLunar2.png"
            alt=""
            fill
            priority
            className="object-contain"
          />
        </div>

      </div>

    </div>
  );
}