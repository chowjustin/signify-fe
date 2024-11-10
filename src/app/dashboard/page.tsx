"use client";

import { useEffect, useState } from "react";
import BreadCrumbs from "@/components/BreadCrumbs";
import Button from "@/components/buttons/Button";
import withAuth from "@/components/hoc/withAuth";
import NextImage from "@/components/NextImage";
import Link from "next/link";
import { FiMail } from "react-icons/fi";
import { FaRegPaperPlane } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

type InboxData = {
  ID: string;
  Name: string;
  Username: string;
  Email: string;
  Topic: string;
  CoverLetter: string;
  Status: string;
  CreatedAt: string;
};
type SentData = {
  S_ID: string;
  S_Name: string;
  S_Username: string;
  S_Email: string;
  S_Topic: string;
  S_CoverLetter: string;
  S_Status: string;
  S_CreatedAt: string;
};

const breadCrumbs = [{ href: "/dashboard", Title: "Dashboard" }];

function isInboxItem(item: InboxData | SentData): item is InboxData {
  return (item as InboxData).Name !== undefined;
}

export default withAuth(Dashboard, "user");
function Dashboard() {
  const [selectedView, setSelectedView] = useState(() => {
    return localStorage.getItem("selectedView") || "inbox";
  });

  useEffect(() => {
    localStorage.setItem("selectedView", selectedView);
  }, [selectedView]);

  const [currentInboxPage, setCurrentInboxPage] = useState(0);
  const [currentSentPage, setCurrentSentPage] = useState(0);

  const { data: inbox } = useQuery({
    queryKey: ["inbox", currentInboxPage],
    queryFn: async () => {
      const response = await api.get(`/sign/inbox?page=${currentInboxPage}`);
      return response.data;
    },
  });

  const { data: sent } = useQuery({
    queryKey: ["sent", currentSentPage],
    queryFn: async () => {
      const response = await api.get(`/sign/sent?page=${currentSentPage}`);
      return response.data;
    },
  });

  const inboxTotalPages = inbox?.total_pages - 1;
  const sentTotalPages = sent?.total_pages - 1;

  const handleInboxNextPage = () => {
    if (currentInboxPage < inboxTotalPages) {
      setCurrentInboxPage((prev) => prev + 1);
    }
  };

  const handleInboxPrevPage = () => {
    if (currentInboxPage > 0) {
      setCurrentInboxPage((prev) => prev - 1);
    }
  };

  const handleSentNextPage = () => {
    if (currentSentPage < sentTotalPages) {
      setCurrentSentPage((prev) => prev + 1);
    }
  };

  const handleSentPrevPage = () => {
    if (currentSentPage > 0) {
      setCurrentSentPage((prev) => prev - 1);
    }
  };

  function parseDate(datetimeString: string) {
    const dateObject = new Date(datetimeString);

    if (isNaN(dateObject.getTime())) {
      console.error("Invalid date:", datetimeString);
      return "";
    }

    const year = dateObject.getFullYear();
    const monthIndex = dateObject.getMonth();
    const day = String(dateObject.getDate()).padStart(2, "0");

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const month = monthNames[monthIndex];

    const hours = String(dateObject.getHours()).padStart(2, "0");
    const minutes = String(dateObject.getMinutes()).padStart(2, "0");
    const time = `${hours}:${minutes}`;

    const today = new Date();
    const isToday =
      dateObject.getDate() === today.getDate() &&
      dateObject.getMonth() === today.getMonth() &&
      dateObject.getFullYear() === today.getFullYear();

    return (
      <>
        <div>
          {isToday ? (
            <div>{time}</div>
          ) : (
            <div>
              {day} {month} {year}
            </div>
          )}
        </div>
      </>
    );
  }

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

        {selectedView === "inbox" ? (
          <>
            {inboxTotalPages > 0 && (
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm max-md:text-xs">
                  Page {currentInboxPage + 1} dari {inboxTotalPages + 1}
                </span>
                <button
                  onClick={handleInboxPrevPage}
                  disabled={currentInboxPage === 0}
                  className=" text-black px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaAngleLeft />
                </button>
                <button
                  onClick={handleInboxNextPage}
                  disabled={currentInboxPage === inboxTotalPages}
                  className=" text-black px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaAngleRight />
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {sentTotalPages > 0 && (
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm max-md:text-xs">
                  Page {currentSentPage + 1} dari {sentTotalPages + 1}
                </span>
                <button
                  onClick={handleSentPrevPage}
                  disabled={currentSentPage === 0}
                  className=" text-black px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaAngleLeft />
                </button>
                <button
                  onClick={handleSentNextPage}
                  disabled={currentSentPage === sentTotalPages}
                  className=" text-black px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaAngleRight />
                </button>
              </div>
            )}
          </>
        )}
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
          {(selectedView === "inbox" ? inbox?.data : sent?.data)?.length > 0 ? (
            (selectedView === "inbox" ? inbox.data : sent.data).map(
              (item: InboxData | SentData, index: number) => (
                <Link
                  href={`/dashboard/${
                    isInboxItem(item) ? item.ID : item.S_ID
                  } `}
                  key={index}
                  className="w-full grid grid-cols-12 py-3 px-4 border-b-1 gap-x-2 justify-center items-center text-center hover:shadow-md hover:border-1"
                >
                  <div className="col-span-2 max-md:col-span-12 max-md:flex max-md:items-center max-md:gap-2 text-left">
                    {isInboxItem(item) ? (
                      <>
                        <p className="font-bold max-md:text-sm">{item.Name}</p>
                        <p className="text-sm max-md:text-xs text-gray-500">
                          {item.Username}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold max-md:text-sm">
                          {item.S_Name}
                        </p>
                        <p className="text-sm max-md:text-xs text-gray-500">
                          {item.S_Username}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="col-span-8 max-md:col-span-10 text-left">
                    <p className="font-semibold max-md:text-sm">
                      {isInboxItem(item) ? item.Topic : item.S_Topic}
                    </p>
                    <p className="text-sm max-md:text-xs text-gray-500 truncate overflow-hidden whitespace-nowrap">
                      {isInboxItem(item)
                        ? item.CoverLetter
                        : item.S_CoverLetter}
                    </p>
                  </div>
                  <p className="col-span-2 text-right max-md:text-xs">
                    {isInboxItem(item) ? (
                      <div>
                        <div
                          className={`font-medium ${
                            item.Status === "Accepted"
                              ? "text-green-500"
                              : item.Status === "Pending" ||
                                  item.Status === "Modified"
                                ? "text-orange-500"
                                : "text-red-500"
                          }`}
                        >
                          {item.Status}
                        </div>
                        {parseDate(item.CreatedAt)}
                      </div>
                    ) : (
                      <div>
                        <div
                          className={`font-medium ${
                            item.S_Status === "Accepted"
                              ? "text-green-500"
                              : item.S_Status === "Pending" ||
                                  item.S_Status === "Modified"
                                ? "text-orange-500"
                                : "text-red-500"
                          }`}
                        >
                          {item.S_Status}
                        </div>
                        {parseDate(item.S_CreatedAt)}
                      </div>
                    )}
                  </p>
                </Link>
              ),
            )
          ) : (
            <p>No items available</p>
          )}
        </div>
      </div>
    </section>
  );
}
