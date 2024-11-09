"use client";

import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Button from "@/components/buttons/Button";
import LabelText from "@/components/form/LabelText";
import NextImage from "@/components/NextImage";
import BreadCrumbs from "@/components/BreadCrumbs";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { AcceptModal } from "./modal/acceptModal";
import { RejectModal } from "./modal/rejectModal";

export default function TambahAjuan() {
  const path = usePathname();
  const pathId = path.split("/").pop();

  const breadCrumbs = [
    { href: "/dashboard", Title: "Dashboard" },
    { href: `/dashboard/${pathId}`, Title: "Detail" },
  ];

  const { data } = useQuery({
    queryKey: ["detail", pathId],
    queryFn: async () => {
      const response = await api.get(`/sign/${pathId}`);
      return response.data.data;
    },
  });

  const statusPending = data?.Status === "Pending" ? true : false;
  const isSender = data?.IsSender === true ? true : false;
  const fileUrl = data?.Document;

  return (
    <section className="p-6 pb-12">
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
            Detail Ajuan Tanda Tangan
          </span>
        </div>
      </div>
      <div className="w-full pt-[30px]">
        <div className="flex max-md:flex-col justify-between">
          <h1 className="font-bold text-xl">{data?.Topic}</h1>
          <div
            className={
              data?.Status === "Accepted"
                ? "text-green-500"
                : data?.Status === "Pending"
                  ? "text-orange-500"
                  : "text-red-500"
            }
          >
            <span className="text-sm font-medium">{data?.Status}</span>
          </div>
        </div>
        <p className="text-sm mt-3">
          {isSender ? "To: " : "From: "} {data?.Username} {"<"}
          {data?.Email}
          {">"}
        </p>
        <h6 className="text-md mt-[30px]">{data?.CoverLetter}</h6>
        {/* File Preview */}
        <div className="flex items-center justify-between mt-8 gap-2 mb-4 lg:w-[75%] w-full 2xl:w-[50%]">
          <LabelText>File Preview</LabelText>
          <a href={fileUrl} download className="">
            <Button variant="outline" size="sm">
              Download File
            </Button>
          </a>
        </div>

        <div className="lg:w-[75%] w-full 2xl:w-[50%] bg-gray-100 p-4 border-3 border-primary border-dashed rounded-lg overflow-auto">
          {fileUrl ? (
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
            >
              <Viewer fileUrl={fileUrl} />
            </Worker>
          ) : (
            <p className="text-center text-gray-500">File not uploaded</p>
          )}
        </div>
      </div>
      <div
        className={`lg:w-[75%] w-full 2xl:w-[50%] flex justify-center gap-4 max-md:gap-2 mt-6 ${
          !statusPending && "hidden"
        } ${isSender && "hidden"}`}
      >
        <RejectModal id={data?.ID}>
          {({ openModal }) => (
            <Button
              variant="red"
              size="base"
              className="min-h-8 max-w-24 px-9 py-0.5"
              onClick={openModal}
            >
              Tolak
            </Button>
          )}
        </RejectModal>
        <AcceptModal id={data?.ID}>
          {({ openModal }) => (
            <Button
              variant="primary"
              size="base"
              className="min-h-8 max-w-24 px-9 py-0.5"
              onClick={openModal}
            >
              Terima
            </Button>
          )}
        </AcceptModal>
      </div>
    </section>
  );
}
