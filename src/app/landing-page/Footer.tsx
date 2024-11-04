import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";

export default function Footer() {
  return (
    <section className="h-[1024px] max-md:h-[300px] relative">
      <NextImage
        src="/landing-page/bottombg.png"
        width={1440}
        height={1024}
        alt="Background"
        className="w-full h-full"
        imgClassName="w-full h-full"
        priority
      />
      <Typography
        variant="sm"
        className="text-black text-center absolute bottom-2 mx-auto w-full max-md:text-[8px]"
      >
        &copy; 2024 Signify
      </Typography>
    </section>
  );
}
