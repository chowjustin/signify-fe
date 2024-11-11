"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { IconType } from "react-icons";
import { FiChevronsLeft, FiChevronsRight, FiLogOut } from "react-icons/fi";
import NextImage from "@/components/NextImage";
import IconButton from "@/components/buttons/IconButton";
import useAuthStore from "@/app/stores/useAuthStore";
import { LogOut } from "./modal/Logout";
import { removeToken } from "@/lib/cookies";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TbMenuDeep } from "react-icons/tb";
import { cn } from "@nextui-org/theme";

type SidenavProps = {
  topNav: {
    title: string;
    icon: IconType;
    link: string;
  }[];
};

export default function Sidebar({ topNav }: SidenavProps) {
  const { user } = useAuthStore();

  const [isOpen, setIsOpen] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const path = usePathname();

  const router = useRouter();

  return (
    <>
      <div
        className={`transition-all max-lg:hidden duration-300 z-50 ${
          isOpen ? "w-full lg:w-[22rem]" : "w-full lg:w-[7rem]"
        } h-screen lg:py-8 bg-[#F8F9FA] lg:drop-shadow-2xl`}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="">
            <div className="relative w-full overflow-visible">
              <IconButton
                icon={isOpen ? FiChevronsLeft : FiChevronsRight}
                size="sm"
                className="absolute top-0 right-0 translate-x-5 overflow-visible"
                onClick={() => setIsOpen(!isOpen)}
              ></IconButton>

              <div className="flex justify-center px-4">
                <div className="flex gap-3 items-center">
                  <Link href="/">
                    <NextImage
                      src="/Signify Logo.png"
                      width={2000}
                      height={2000}
                      alt="Signify"
                      className="max-w-[48px]"
                    />
                  </Link>
                  {isOpen && (
                    <div className="leading-[16px] ">
                      <p className="text-[16px] font-bold">{user?.name}</p>
                      <p className="text-[14px]">{user?.username}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <NextImage
              src="/line.png"
              width={2000}
              height={2000}
              alt="Signify"
              className="w-full mt-[30px] mb-[26px]"
            />

            {topNav.map((link) => (
              <Link
                href={link.link}
                key={link.title}
                className={`flex flex-row items-center text-[14px] text-black mx-6 my-4 py-4 rounded-xl ${
                  path === link.link
                    ? "bg-[#4FD1C5] text-white font-bold"
                    : "hover:bg-gray-100 bg-white shadow-sm"
                } ${isOpen ? "space-x-3 mx-6 px-6" : ""}`}
              >
                <link.icon
                  className={`text-2xl items-center ${
                    path === link.link ? "text-white" : "text-[#4FD1C5]"
                  } ${isOpen ? "" : "mx-auto"}`}
                />
                <p className={`text-S1 ${isOpen ? "visible" : "hidden"}`}>
                  {link.title}
                </p>
              </Link>
            ))}
          </div>

          <div className="">
            {/* <Link
              href={"/dashboard/settings"}
              className={`flex flex-row items-center space-x-5 my-6 hover:text-hover ${
                isOpen ? "px-12" : ""
              }`}
            >
              <FiSettings className={`text-2xl ${isOpen ? "" : "mx-auto"}`} />
              <p className={`text-S1 ${isOpen ? "visible" : "hidden"}`}>
                Pengaturan
              </p>
            </Link> */}

            <LogOut>
              {({ openModal }) => (
                <div
                  onClick={openModal}
                  className={`flex flex-row cursor-pointer items-center space-x-5 my-6 hover:text-hover ${
                    isOpen ? "px-12" : ""
                  }`}
                >
                  <FiLogOut className={`text-2xl ${isOpen ? "" : "mx-auto"}`} />
                  <p className={`text-S1 ${isOpen ? "visible" : "hidden"}`}>
                    Keluar
                  </p>
                </div>
              )}
            </LogOut>
          </div>
        </div>
      </div>
      {/* Mobile Navbar */}

      <nav
        className={cn(
          "fixed top-0 z-50 lg:hidden bg-[url(/images/nav/navbg.png)]",
          "h-[48px] w-full md:h-[72px]",
          "flex items-center justify-center shadow-lg",
        )}
      >
        <section className="relative flex h-full w-full flex-row items-center justify-between">
          <Link href="/">
            <NextImage
              src="/Signify Logo White.png"
              alt="Logo Signify"
              width={230}
              height={161}
              className="ml-6 w-[36px] object-contain md:w-[56px]"
            />
          </Link>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger className="mr-2 h-full">
              <TbMenuDeep className="min-h-[3rem] min-w-[3rem] p-4 text-white" />
            </SheetTrigger>
            <SheetContent className="z-[101] w-screen bg-[#F8F9FA]">
              <SheetHeader>
                <SheetDescription className="flex flex-col w-full items-start gap-5">
                  <div className="flex justify-center px-4">
                    <div className="flex gap-3 items-center">
                      <Link href="/">
                        <NextImage
                          src="/Signify Logo.png"
                          width={2000}
                          height={2000}
                          alt="Signify"
                          className="max-w-[48px]"
                        />
                      </Link>
                      <div className="leading-[16px] text-left">
                        <p className="text-[16px] font-bold">{user?.name}</p>
                        <p className="text-[14px]">{user?.username}</p>
                      </div>
                    </div>
                  </div>
                  <NextImage
                    src="/line.png"
                    width={2000}
                    height={2000}
                    alt="Signify"
                    className="w-full"
                  />
                  {topNav.map((link) => (
                    <Link
                      href={link.link}
                      key={link.title}
                      className={`flex flex-row space-x-3 px-6 w-full items-center text-[14px] text-black py-4 rounded-xl ${
                        path === link.link
                          ? "bg-[#4FD1C5] text-white font-bold"
                          : "hover:bg-gray-100 bg-white shadow-sm"
                      } `}
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <link.icon
                        className={`text-2xl items-center ${
                          path === link.link ? "text-white" : "text-[#4FD1C5]"
                        } `}
                      />
                      <p className={`text-S1`}>{link.title}</p>
                    </Link>
                  ))}
                  <div className="px-2 absolute bottom-0">
                    {/* <Link
                      href={"/dashboard/settings"}
                      className={`flex flex-row items-center space-x-5 my-6 hover:text-hover px-12}`}
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <FiSettings className={`text-2xl mx-auto`} />
                      <p className={`text-S1`}>Pengaturan</p>
                    </Link> */}

                    <div
                      onClick={() => {
                        removeToken();
                        router.replace("/signin");
                      }}
                      className={`flex flex-row cursor-pointer items-center space-x-5 my-6 hover:text-hover px-12}`}
                    >
                      <FiLogOut className={`text-2xl`} />
                      <p className={`text-S1`}>Keluar</p>
                    </div>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </section>
      </nav>
    </>
  );
}
