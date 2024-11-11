"use client";
import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";
import { FaRegUser } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { IoHome } from "react-icons/io5";

type ChildrenLayoutProps = {
  children: ReactNode;
};

const NavbarLinks = [
  {
    title: "Dashboard",
    icon: IoHome,
    link: "/dashboard",
  },
  {
    title: "Tambah Ajuan",
    icon: FiFileText,
    link: "/dashboard/tambah",
  },
  {
    title: "Profile",
    icon: FaRegUser,
    link: "/dashboard/profile",
  },
];

const ChildrenLayout = ({ children }: ChildrenLayoutProps) => {
  return (
    <div className="flex lg:max-h-screen lg:h-screen lg:max-w-screen lg:w-screen">
      <Sidebar topNav={NavbarLinks} />
      <div className="max-md:pt-[48px] max-lg:pt-[72px] lg:flex lg:flex-col lg:max-h-screen h-full w-full">
        <div className="lg:max-h-screen lg:h-nav lg:overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChildrenLayout;
