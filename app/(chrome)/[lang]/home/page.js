import HomeTransmutationImage from "@/components/HomeTransmutationImage";

export default async function HomePage({ params }) {
  const { lang } = await params;

  return (
    <div
      className="
        w-full
        flex
        justify-center
        items-start
        md:items-center
        pt-8
        md:pt-0
        h-full

        md:pl-[100px]
        lg:pl-[120px]
      "
    >
      <link rel="preload" as="image" href="/Home1.webp" />

      <div
        className="
          w-[calc(100vw-2.5rem)]
          md:w-full

          max-w-none
          md:max-w-[600px]

          px-0
        "
      >
        <HomeTransmutationImage />
      </div>
    </div>
  );
}