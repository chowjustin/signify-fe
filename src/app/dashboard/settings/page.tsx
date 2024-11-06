"use client";

import useAuthStore from "@/app/stores/useAuthStore";
import BreadCrumbs from "@/components/BreadCrumbs";
import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import withAuth from "@/components/hoc/withAuth";
import { user } from "@nextui-org/theme";
import { FaPenToSquare } from "react-icons/fa6";
import Button from "@/components/buttons/Button";

const breadCrumbs = [
  { href: "/dashboard", Title: "Dashboard" },
  { href: "/dashboard/settings", Title: "Settings" },
];

// export default withAuth(Settings, "user");
export default function Settings() {
  return (
    <section className="p-6">
      <div className="relative w-full h-full rounded-[15px] min-h-[64px] overflow-hidden">
        <NextImage
          src="/bgbreadcrumb.png"
          width={1920}
          height={1080}
          alt="Background"
          className="w-full h-full -z-10 min-h-[64px]"
          imgClassName="w-full h-[64px] md:h-[80px]"
        />
        <div className="absolute z-10 top-4 left-6 max-md:top-2 max-md:left-3 max-md:mb-0">
          <BreadCrumbs breadcrumbs={breadCrumbs} />
          <span className="font-semibold text-white max-md:-pt-1">
            Settings
          </span>
        </div>
      </div>
      <div className="w-[90%] rounded-lg z-10 mt-4 space-y-4  shadow-lg mx-auto p-12 max-sm:p-4">
        <div className="space-y-4">
          <Typography className="text-[#2D3748]" variant="h6" weight="bold">
            Account Information
          </Typography>
          <div className="flex">
            <Typography className="text-[#718096] font-bold">Nama :</Typography>
            <Typography className="text-[#718096]">
              &nbsp; ProfJustin
            </Typography>
            <div>
              <FaPenToSquare className="ml-4 mt-1" color="#718096" />
            </div>
          </div>
          <div className="flex">
            <Typography className="text-[#718096] font-bold">
              Email :
            </Typography>
            <Typography className="text-[#718096]">
              &nbsp; profjustinjagobanget@gmail.com
            </Typography>
            <div>
              <FaPenToSquare className="ml-4 mt-1" color="#718096" />
            </div>
          </div>
          <div className="flex">
            <Typography className="text-[#718096] font-bold">
              Password :
            </Typography>
            <Typography className="text-[#718096]">&nbsp; ********</Typography>
            <div>
              <FaPenToSquare className="ml-4 mt-1" color="#718096" />
            </div>
          </div>
          <div className="flex">
            <Typography className="text-[#718096] font-bold">TTD :</Typography>
            <NextImage
              src="/Signify Logo.png"
              width={500}
              height={500}
              alt="TTD Preview"
              className="w-[100px] object-contain md:w-[160px] ml-4 rounded-lg overflow-hidden border-2 border-[#718096] p-2"
            />
            <div>
              <FaPenToSquare className="ml-4 mt-1" color="#718096" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
