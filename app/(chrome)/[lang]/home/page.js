import HomeTransmutationImage from "@/components/HomeTransmutationImage";

export default async function HomePage({ params }) {
  const { lang } = await params;

  return (
    <div
      className="
        w-full
        flex
        justify-center
        items-center
        h-full

        md:pl-[120px]
        lg:pl-[160px]
      "
    >
      <div className="w-full max-w-[600px] px-6 md:px-0">
        <HomeTransmutationImage />
      </div>
    </div>
  );
}