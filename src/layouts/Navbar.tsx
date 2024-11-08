"use client";

import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import * as React from "react";
import ButtonLink from "@/components/links/ButtonLink";
import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import clsxm from "@/lib/clsxm";

const dataNavbar = [
  {
    href: "hero",
    title: "Home",
  },
  {
    href: "about",
    title: "About",
  },
];

export default function Navbar() {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      let offset;
      if (window.innerWidth < 768) {
        offset = element.getBoundingClientRect().top + window.scrollY - 66;
      } else if (window.innerWidth < 1280) {
        offset = element.getBoundingClientRect().top + window.scrollY - 74;
      } else {
        offset = element.getBoundingClientRect().top + window.scrollY - 90;
      }
      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <nav
        className={clsxm(
          "fixed left-1/2 top-[48px] z-50 -translate-x-1/2 lg:top-[64px] bg-white",
          "h-[48px] w-10/12 rounded-full md:h-[72px]",
          "flex items-center justify-center shadow-lg",
        )}
      >
        <section className="relative flex h-full w-full flex-row items-center justify-between">
          <Link href="/">
            <NextImage
              src="/Signify Logo.png"
              alt="Logo Signify"
              width={230}
              height={161}
              className="ml-10 w-[40px] object-contain md:w-[56px]"
            />
          </Link>

          {/* Desktop Navbar */}
          <div className="mr-6 hidden flex-row items-center gap-6 lg:flex">
            {dataNavbar.map((item, index) => (
              // <UnstyledLink href={item.href} key={index}>
              <div
                onClick={() => handleClick(item.href)}
                key={index}
                className="cursor-pointer"
              >
                <Typography
                  variant="p"
                  weight="semibold"
                  className="text-primary hover:text-hover active:text-active"
                >
                  {item.title}
                </Typography>
              </div>
              // </UnstyledLink>
            ))}
            <ButtonLink href="/dashboard" className="md:px-5">
              Dashboard
            </ButtonLink>
          </div>

          {/* Mobile Navbar */}
          <div className="relative mt-1 lg:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger className="mr-6 h-full">
                <GiHamburgerMenu className="min-h-[3rem] min-w-[3rem] p-4 text-black" />
              </SheetTrigger>
              <SheetContent className="z-[101]">
                <SheetHeader>
                  <SheetDescription className="flex flex-col items-start gap-6 py-6">
                    {dataNavbar.map((item, index) => (
                      // <UnstyledLink
                      //   key={index}
                      //   href={item.href}
                      //   className="px-6"
                      // >
                      <div
                        onClick={() => {
                          setIsSheetOpen(false);
                          handleClick(item.href);
                        }}
                        key={index}
                        className="cursor-pointer"
                      >
                        <Typography
                          variant="p"
                          weight="semibold"
                          className="text-xl text-primary hover:text-hover active:text-active"
                        >
                          {item.title}
                        </Typography>
                        {/* </UnstyledLink> */}
                      </div>
                    ))}
                    <ButtonLink href="/dashboard" className="w-full md:px-5">
                      Dashboard
                    </ButtonLink>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </section>
      </nav>
    </>
  );
}
