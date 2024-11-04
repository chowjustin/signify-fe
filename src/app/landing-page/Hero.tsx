import ButtonLink from "@/components/links/ButtonLink";
import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import { cn } from "@nextui-org/theme";

export default function Hero() {
  return (
    <section
      className="h-screen w-full relative flex items-center justify-center"
      id="hero"
    >
      <NextImage
        src="/landing-page/bg.png"
        width={1440}
        height={1024}
        alt="Background"
        className="w-full h-full -z-10"
        imgClassName="w-full h-full"
        priority
      />
      <div className="absolute z-10 max-sm:px-6">
        <Typography
          variant="h5"
          weight="bold"
          className="text-center text-[28px] leading-[40px] md:text-[40px] md:leading-[56px] xl:text-[72px] xl:leading-[90px]"
        >
          Discover the power of <br /> our products!
        </Typography>
        <Typography className="text-center max-w-[60%] max-sm:text-[14px] mx-auto mt-16 max-sm:mt-8 max-sm:max-w-full">
          Signify is a streamlined document-signing web application designed to
          simplify and accelerate the signing process. With Signify, users can
          complete document signing with a single click. Users upload their
          documents and send a request to a specified username for signature
          approval. The recipient can then easily approve or reject the request.
          Upon approval, the document is automatically signed and promptly
          returned to the requester, fully signed and ready for use. Signify’s
          efficient workflow eliminates the hassle of manual signatures,
          providing a secure, fast, and user-friendly solution for managing
          document approvals digitally.
        </Typography>

        <div className="w-full flex justify-center gap-6 mt-12 max-sm:mt-6">
          <ButtonLink
            href="/signup"
            size="lg"
            className="sm:w-[200px] rounded-md"
          >
            Sign Up
          </ButtonLink>
          <ButtonLink
            href="/signin"
            size="lg"
            variant="outline"
            className={cn(
              "text-black",
              "border-[2.5px] border-black",
              "hover:border-active hover:text-active",
              "active:bg-[#F2FFFE]",
              "focus-visible:ring-[#C7FFFA]",
              "sm:w-[200px] rounded-md",
            )}
          >
            Sign In
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
