"use client";
import Sidenav from "@/components/Sidebar";
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
    link: "/sandbox",
  },
  {
    title: "Button",
    icon: FaRegUser,
    link: "/sandbox/button",
  },
  {
    title: "Form",
    icon: FiFileText,
    link: "/sandbox/form",
  },
  {
    title: "Sign Up",
    icon: MdRocketLaunch,
    link: "/register",
  },
];

const ChildrenLayout = ({ children }: ChildrenLayoutProps) => {
  return (
    <div className="flex max-h-screen h-screen max-w-screen w-screen">
      <Sidenav topNav={NavbarLinks} />
      <div className="hidden lg:flex flex-col max-h-screen h-full w-full">
        <div className="max-h-screen h-nav overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default ChildrenLayout;
