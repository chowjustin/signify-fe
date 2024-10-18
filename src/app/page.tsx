import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";

export default function Home() {
  return (
    <main className="bg-[url('/images/bg.png')] w-screen h-screen flex flex-col items-center gap-2 md:gap-6 justify-center">
      <NextImage
        src="/Signify Logo White.png"
        width={2000}
        height={2000}
        alt="Signify"
        className="max-w-[50%] md:max-w-[20%]"
      />
      <Typography
        variant="h1"
        weight="bold"
        className="text-white max-sm:text-[40px]"
      >
        Signify
      </Typography>
    </main>
  );
}
