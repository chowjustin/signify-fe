"use client";

import { useState } from "react";
import BreadCrumbs from "@/components/BreadCrumbs";
import Button from "@/components/buttons/Button";
import withAuth from "@/components/hoc/withAuth";
import NextImage from "@/components/NextImage";
import Link from "next/link";
import { FiMail } from "react-icons/fi";
import { FaRegPaperPlane } from "react-icons/fa";

type InboxItem = {
  sender_id: number;
  sender_name: string;
  sender_username: string;
  sender_topic: string;
  sender_coverletter: string;
  sender_datetime: string;
};

type SentItem = {
  receiver_id: number;
  receiver_name: string;
  receiver_username: string;
  receiver_topic: string;
  receiver_coverletter: string;
  receiver_datetime: string;
};

const inbox: InboxItem[] = [
  {
    sender_id: 1,
    sender_name: "Nama 1",
    sender_username: "username",
    sender_topic: "Permohonan ajuan ttd Genetic Algorithm",
    sender_coverletter: "Bacot disini kalau ada cover letter",
    sender_datetime: "6 Nov 2024",
  },
  {
    sender_id: 2,
    sender_name: "Nama 2",
    sender_username: "username",
    sender_topic: "Permohonan ajuan ttd Genetic Algorithm",
    sender_coverletter: "Bacot disini kalau ada cover letter",
    sender_datetime: "6 Nov 2024",
  },
  {
    sender_id: 3,
    sender_name: "Nama 3",
    sender_username: "username",
    sender_topic: "Permohonan ajuan ttd Genetic Algorithm",
    sender_coverletter: "Bacot disini kalau ada cover letter",
    sender_datetime: "6 Nov 2024",
  },
  {
    sender_id: 4,
    sender_name: "Nama 4",
    sender_username: "username",
    sender_topic: "Permohonan ajuan ttd Genetic Algorithm",
    sender_coverletter: "Bacot disini kalau ada cover letter",
    sender_datetime: "6 Nov 2024",
  },
  {
    sender_id: 5,
    sender_name: "Nama 5",
    sender_username: "username",
    sender_topic: "Permohonan ajuan ttd Genetic Algorithm",
    sender_coverletter: "Bacot disini kalau ada cover letter",
    sender_datetime: "6 Nov 2024",
  },
  {
    sender_id: 6,
    sender_name: "Nama 6",
    sender_username: "username",
    sender_topic: "Permohonan ajuan ttd Genetic Algorithm",
    sender_coverletter: "Bacot disini kalau ada cover letter",
    sender_datetime: "6 Nov 2024",
  },
  {
    sender_id: 7,
    sender_name: "Nama 7",
    sender_username: "username",
    sender_topic: "Permohonan ajuan ttd Genetic Algorithm",
    sender_coverletter: "Bacot disini kalau ada cover letter",
    sender_datetime: "6 Nov 2024",
  },
];

const sent: SentItem[] = [
  {
    receiver_id: 1,
    receiver_name: "Nama 1",
    receiver_username: "username",
    receiver_topic: "Permohonan ajuan ttd Genetic Algorithm",
    receiver_coverletter: "Bacot disini kalau ada cover letter",
    receiver_datetime: "6 Nov 2024",
  },
  {
    receiver_id: 2,
    receiver_name: "Nama 2",
    receiver_username: "username",
    receiver_topic: "Permohonan ajuan ttd Genetic Algorithm",
    receiver_coverletter: "Bacot disini kalau ada cover letter",
    receiver_datetime: "6 Nov 2024",
  },
  {
    receiver_id: 3,
    receiver_name: "Nama 3",
    receiver_username: "username",
    receiver_topic: "Permohonan ajuan ttd Genetic Algorithm",
    receiver_coverletter: "Bacot disini kalau ada cover letter",
    receiver_datetime: "6 Nov 2024",
  },
];

const breadCrumbs = [{ href: "/dashboard", Title: "Dashboard" }];

function isInboxItem(item: InboxItem | SentItem): item is InboxItem {
  return (item as InboxItem).sender_name !== undefined;
}

export default withAuth(Dashboard, "user");
function Dashboard() {
  const [selectedView, setSelectedView] = useState("inbox");

  return (
    <section className="p-6 max-md:p-3">
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
            {selectedView === "inbox" ? "Inbox" : "Sent"}
          </span>
        </div>
      </div>
      <div className="w-full flex my-[30px] items-center justify-between">
        <div className="flex gap-3">
          <Button
            variant="primary"
            size="sm"
            className={`w-[50px] shadow-md ${
              selectedView === "inbox" ? "" : "bg-white border-white text-black"
            }`}
            onClick={() => setSelectedView("inbox")}
          >
            <FiMail className="text-xl" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            className={`w-[50px] shadow-md ${
              selectedView === "sent" ? "" : "bg-white border-white text-black"
            }`}
            onClick={() => setSelectedView("sent")}
          >
            <FaRegPaperPlane className="text-xl" />
          </Button>
        </div>
        <div className="text-sm max-md:text-xs">Page 1 dari 10 </div>
      </div>

      <div className="w-full rounded-lg">
        <div className="grid grid-cols-12 max-md:hidden p-1 text-[#A0AEC0] font-bold text-[12px] px-4 border-b-1">
          <p className="col-span-2">
            {selectedView === "inbox" ? "SENDER" : "RECEIVER"}
          </p>
          <p className="col-span-8">DESCRIPTION</p>
          <p className="col-span-2 text-right">TIME</p>
        </div>
        <div className="grid grid-cols-12 md:hidden p-1 text-[#A0AEC0] font-bold text-[12px] px-4 border-b-1">
          <p className="col-span-10">
            {selectedView === "inbox" ? "INBOX" : "SENT"}
          </p>
          <p className="col-span-2 text-right">TIME</p>
        </div>

        <div>
          {(selectedView === "inbox" ? inbox : sent).map((item, index) => (
            <Link
              href={"/inbox/detail"}
              key={index}
              className="w-full grid grid-cols-12 py-3 px-4 border-b-1 gap-x-2 justify-center items-center text-center hover:shadow-md hover:border-1"
            >
              <div className="col-span-2 max-md:col-span-12 max-md:flex max-md:items-center max-md:gap-2 text-left">
                {isInboxItem(item) ? (
                  <>
                    <p className="font-bold max-md:text-sm">
                      {item.sender_name}
                    </p>
                    <p className="text-sm max-md:text-xs text-gray-500">
                      {item.sender_username}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-bold max-md:text-sm">
                      {item.receiver_name}
                    </p>
                    <p className="text-sm max-md:text-xs text-gray-500">
                      {item.receiver_username}
                    </p>
                  </>
                )}
              </div>
              <div className="col-span-8 max-md:col-span-10 text-left">
                <p className="font-semibold max-md:text-sm">
                  {isInboxItem(item) ? item.sender_topic : item.receiver_topic}
                </p>
                <p className="text-sm max-md:text-xs text-gray-500 truncate overflow-hidden whitespace-nowrap">
                  {isInboxItem(item)
                    ? item.sender_coverletter
                    : item.receiver_coverletter}
                </p>
              </div>
              <p className="col-span-2 text-right max-md:text-xs">
                {isInboxItem(item)
                  ? item.sender_datetime
                  : item.receiver_datetime}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
