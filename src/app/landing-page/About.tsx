import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";

export default function About() {
  return (
    <section
      className="pl-[120px] pr-[100px] max-md:pl-[60px] max-md:pr-[50px] max-sm:pl-[20px] max-sm:pr-[15px] flex"
      id="about"
    >
      <div className="w-1/2 pr-[8%] md:pr-[15%] xl:pr-[25%] max-lg:pt-6 max-lg:pb-12 pt-12 pb-24 max-sm:pt-2 max-sm:pb-2 flex flex-col justify-between">
        <Typography
          variant="h5"
          weight="bold"
          className="text-primary text-[22px] leading-[28px] md:text-[30px] md:leading-[48px] xl:text-[58px] xl:leading-[58px]"
        >
          Signing has never been easier with us!
        </Typography>

        <div>
          <NextImage
            src="/landing-page/sign.png"
            width={1440}
            height={1024}
            alt="Sign"
            className="w-1/2 mx-auto"
          />
          <hr className="h-[4px] bg-primary w-full" />
          <Typography
            variant="sm"
            weight="bold"
            className="text-primary text-center max-sm:text-[10px]"
          >
            The Best Digital Signature Adder
          </Typography>
        </div>
      </div>
      <NextImage
        src="/landing-page/about.png"
        width={1440}
        height={1024}
        alt="About"
        className="w-1/2 h-full "
      />
    </section>
  );
}
