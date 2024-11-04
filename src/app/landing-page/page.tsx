import ButtonLink from "@/components/links/ButtonLink";
import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import Layout from "@/layouts/Layout";

import { cn } from "@nextui-org/theme";

export default function LandingPage() {
  return (
    <Layout withNavbar withFooter>
      <main>
        <section className="h-screen w-full relative flex items-center justify-center">
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
              Signify is a streamlined document-signing web application designed
              to simplify and accelerate the signing process. With Signify,
              users can complete document signing with a single click. Users
              upload their documents and send a request to a specified username
              for signature approval. The recipient can then easily approve or
              reject the request. Upon approval, the document is automatically
              signed and promptly returned to the requester, fully signed and
              ready for use. Signify’s efficient workflow eliminates the hassle
              of manual signatures, providing a secure, fast, and user-friendly
              solution for managing document approvals digitally.
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
        <section className="pl-[120px] pr-[100px] max-md:pl-[60px] max-md:pr-[50px] max-sm:pl-[20px] max-sm:pr-[15px] flex">
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
      </main>
    </Layout>
  );
}
