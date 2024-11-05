"use client";
import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";
import { FaRegUser } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { IoHome } from "react-icons/io5";
import { MdRocketLaunch } from "react-icons/md";

type ChildrenLayoutProps = {
  children: ReactNode;
};

const NavbarLinks = [
  {
    title: "Home",
    icon: IoHome,
    link: "/",
  },
  {
    title: "Profile",
    icon: FaRegUser,
    link: "/profile",
  },
  {
    title: "Tambah Ajuan",
    icon: FiFileText,
    link: "/ajuan",
  },
  {
    title: "Dashboard",
    icon: MdRocketLaunch,
    link: "/dashboard",
  },
];

const ChildrenLayout = ({ children }: ChildrenLayoutProps) => {
  return (
    <div className="flex max-h-screen h-screen max-w-screen w-screen">
      <Sidebar topNav={NavbarLinks} />
      <div className="hidden lg:flex flex-col max-h-screen h-full w-full">
        <div className="max-h-screen h-nav overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default ChildrenLayout;
