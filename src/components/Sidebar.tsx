"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { IconType } from "react-icons";
import {
  FiChevronsLeft,
  FiChevronsRight,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import NextImage from "@/components/NextImage";
// import { LogOut } from "./modal/Logout";
import IconButton from "@/components/buttons/IconButton";
import { removeToken } from "@/lib/cookies";
import useAuthStore from "@/app/stores/useAuthStore";

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
  const path = usePathname();

  return (
    <>
      <div
        className={`transition-all duration-300 ${
          isOpen ? "w-full lg:w-[22rem]" : "w-full lg:w-[7rem]"
        } h-screen lg:py-8 bg-[#F8F9FA] lg:drop-shadow-2xl`}
      >
        <div className="hidden lg:flex h-full flex-col justify-between">
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
            <Link
              href={"/settings"}
              className={`flex flex-row items-center space-x-5 my-6 hover:text-hover ${
                isOpen ? "px-12" : ""
              }`}
            >
              <FiSettings className={`text-2xl ${isOpen ? "" : "mx-auto"}`} />
              <p className={`text-S1 ${isOpen ? "visible" : "hidden"}`}>
                Pengaturan
              </p>
            </Link>
            <div
              className={`flex flex-row items-center space-x-5 my-6 hover:text-hover ${
                isOpen ? "px-12" : ""
              }`}
              onClick={() => removeToken()}
            >
              <FiLogOut className={`text-2xl ${isOpen ? "" : "mx-auto"}`} />
              <p className={`text-S1 ${isOpen ? "visible" : "hidden"}`}>
                Keluar
              </p>
            </div>

            {/* <LogOut>
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
            </LogOut> */}
          </div>
        </div>
      </div>
    </>
  );
}
