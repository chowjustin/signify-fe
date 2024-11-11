"use client";

import useAuthStore from "@/app/stores/useAuthStore";
import BreadCrumbs from "@/components/BreadCrumbs";
import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import withAuth from "@/components/hoc/withAuth";
import { FaPenToSquare } from "react-icons/fa6";
import { EditNameModal } from "./modals/editNameModal";
import { EditUsernameModal } from "./modals/editUsernameModal";
import { EditEmailModal } from "./modals/editEmailModal";
import { EditPasswordModal } from "./modals/editPasswordModal";
import { EditTTDModal } from "./modals/editTTDModal";
import { DeleteUserModal } from "./modals/deleteUserModal";
import Button from "@/components/buttons/Button";

const breadCrumbs = [
  { href: "/dashboard", Title: "Dashboard" },
  { href: "/dashboard/profile", Title: "Profile" },
];

export default withAuth(Settings, "user");
function Settings() {
  const { user } = useAuthStore();

  return (
    <section className="p-6">
      <div className="relative w-full h-full rounded-[15px] min-h-[64px] overflow-hidden">
        <NextImage
          src="/bgbreadcrumb.png"
          width={1920}
          height={1080}
          alt="Background"
          priority
          className="w-full h-full -z-10 min-h-[64px]"
          imgClassName="w-full h-[64px] md:h-[80px]"
        />
        <div className="absolute z-10 top-4 left-6 max-md:top-2 max-md:left-3 max-md:mb-0">
          <BreadCrumbs breadcrumbs={breadCrumbs} />
          <span className="font-semibold text-white max-md:-pt-1">Profile</span>
        </div>
      </div>
      <div className="w-full border-1 rounded-[15px] z-10 mt-4 space-y-4 shadow-lg mx-auto p-12 max-sm:p-4">
        <div className="space-y-4">
          <Typography className="text-[#2D3748]" variant="h6" weight="bold">
            Account Information
          </Typography>
          <div className="flex">
            <Typography className="text-[#718096] truncate">
              <span className="font-bold">Nama :</span> {user?.name}
            </Typography>
            <div>
              <EditNameModal data={user}>
                {({ openModal }) => (
                  <FaPenToSquare
                    className="ml-4 mt-1 cursor-pointer text-[#718096] hover:text-hover"
                    onClick={openModal}
                  />
                )}
              </EditNameModal>
            </div>
          </div>
          <div className="flex">
            <Typography className="text-[#718096] truncate">
              <span className="font-bold">Username :</span> {user?.username}
            </Typography>
            <div>
              <EditUsernameModal data={user}>
                {({ openModal }) => (
                  <FaPenToSquare
                    className="ml-4 mt-1 cursor-pointer text-[#718096] hover:text-hover"
                    onClick={openModal}
                  />
                )}
              </EditUsernameModal>
            </div>
          </div>
          <div className="flex">
            <Typography className="text-[#718096] truncate">
              <span className="font-bold">Email :</span> {user?.email}
            </Typography>
            <div>
              <EditEmailModal data={user}>
                {({ openModal }) => (
                  <FaPenToSquare
                    className="ml-4 mt-1 cursor-pointer text-[#718096] hover:text-hover"
                    onClick={openModal}
                  />
                )}
              </EditEmailModal>
            </div>
          </div>
          <div className="flex">
            <Typography className="text-[#718096] truncate">
              <span className="font-bold">Password :</span> ********
            </Typography>
            <div>
              <EditPasswordModal>
                {({ openModal }) => (
                  <FaPenToSquare
                    className="ml-4 mt-1 cursor-pointer text-[#718096] hover:text-hover"
                    onClick={openModal}
                  />
                )}
              </EditPasswordModal>
            </div>
          </div>
          <div className="">
            <div className="flex">
              <Typography className="text-[#718096] font-bold truncate">
                Preview TTD
              </Typography>
              <EditTTDModal>
                {({ openModal }) => (
                  <FaPenToSquare
                    className="ml-4 mt-1 cursor-pointer text-[#718096] hover:text-hover"
                    onClick={openModal}
                  />
                )}
              </EditTTDModal>
            </div>
            <div className="">
              <img
                src={user?.ttd}
                alt="TTD Preview"
                className="w-fit object-contain mt-2 rounded-lg overflow-hidden border-2 border-[#718096] p-2"
              />
            </div>
          </div>
          <div>
            <DeleteUserModal>
              {({ openModal }) => (
                <Button
                  variant="red"
                  size="base"
                  className="min-h-8 w-fit px-4 py-0.5"
                  onClick={openModal}
                >
                  Delete User
                </Button>
              )}
            </DeleteUserModal>
          </div>
        </div>
      </div>
    </section>
  );
}
