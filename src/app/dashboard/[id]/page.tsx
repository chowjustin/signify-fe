"use client";

import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Button from "@/components/buttons/Button";
import LabelText from "@/components/form/LabelText";
import NextImage from "@/components/NextImage";
import BreadCrumbs from "@/components/BreadCrumbs";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { AcceptModal } from "./modal/acceptModal";
import { RejectModal } from "./modal/rejectModal";
import { EditModal } from "./modal/editModal";
import { useEffect, useState } from "react";
import withAuth from "@/components/hoc/withAuth";
import useAuthStore from "@/app/stores/useAuthStore";

type AreaSelection = {
  page: number;
  x: number;
  y: number;
  w: number;
  h: number;
};

export default withAuth(DetailAjuan, "user");
function DetailAjuan() {
  const path = usePathname();
  const pathId = path.split("/").pop();

  const breadCrumbs = [
    { href: "/dashboard", Title: "Dashboard" },
    { href: `/dashboard/${pathId}`, Title: "Detail" },
  ];

  const { user } = useAuthStore();

  const { data } = useQuery({
    queryKey: ["detail", pathId],
    queryFn: async () => {
      const response = await api.get(`/sign/${pathId}`);
      return response.data.data;
    },
  });

  const statusPending = data?.Status === "Pending" ? true : false;
  const isAccepted = data?.Status === "Accepted" ? true : false;
  const isSender = data?.IsSender === true ? true : false;
  const fileUrl = data?.Document;

  const [scaledSelections, setScaledSelections] = useState([]);
  const [unscaledSelections, setunscaledSelections] = useState([]);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const renderPage = (props: any) => {
    const { pageIndex } = props;
    const pageNumber = pageIndex + 1;

    return (
      <div
        id="preview-page"
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          cursor: "default",
          zIndex: 100,
        }}
      >
        {props.canvasLayer.children}
        {scaledSelections.map(
          (selection: AreaSelection, index: number) =>
            selection.page === pageNumber &&
            (isSender && user?.ttd ? (
              <div
                className={`${!isAccepted ? "flex" : "hidden"}`}
                key={index}
                style={{
                  position: "absolute",
                  left: selection.x,
                  top: selection.y,
                  width: selection.w,
                  height: selection.h,
                  border: "2px dashed green",
                  backgroundColor: "rgba(0, 255, 0, 0.1)",
                  pointerEvents: "none",
                }}
              />
            ) : (
              <div
                className={`${!isAccepted ? "flex" : "hidden"}`}
                key={index}
                style={{
                  position: "absolute",
                  left: selection.x,
                  top: selection.y,
                  width: selection.w,
                  pointerEvents: "none",
                }}
              >
                <img
                  src={user?.ttd}
                  alt="ttd"
                  style={{
                    width: "100%",
                  }}
                />
              </div>
            )),
        )}
      </div>
    );
  };

  useEffect(() => {
    const checkPageExists = () => {
      const page = document.getElementById("preview-page");
      if (page && data?.Positions) {
        const rect = page.getBoundingClientRect();

        const scaleX = 595 / rect.width;
        const scaleY = 842 / rect.height;

        const scaled = data.Positions.map((position: AreaSelection) => ({
          page: position.page,
          x: position.x / scaleX,
          y: position.y / scaleY,
          w: position.w / scaleX,
          h: 60 / scaleY,
        }));

        const unscaled = data.Positions.map((position: AreaSelection) => ({
          page: position.page,
          x: position.x,
          y: position.y,
          w: position.w,
          h: 60,
        }));

        setScaledSelections(scaled);
        setunscaledSelections(unscaled);

        clearInterval(intervalId);
      }
    };

    const intervalId = setInterval(checkPageExists, 100);
    return () => clearInterval(intervalId);
  }, [data]);

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
                : data?.Status === "Pending" || data?.Status === "Modified"
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
        <p className="text-md mt-[30px] max-w-full break-words">
          {data?.CoverLetter}
        </p>
        {/* File Preview */}
        <div className="flex items-center justify-between mt-8 gap-2 mb-4 lg:w-[75%] w-full 2xl:w-[50%]">
          <LabelText>File Preview</LabelText>
          <a
            href={fileUrl}
            download
            className={`${isAccepted ? "flex" : "hidden"}`}
            target="blank"
          >
            <Button variant="outline" size="sm">
              Download File
            </Button>
          </a>
        </div>

        <div className="lg:w-[75%] w-full 2xl:w-[50%] max-md:h-[45vh] h-[80vh] bg-gray-100 p-4 border-3 border-primary border-dashed rounded-lg overflow-auto">
          {fileUrl ? (
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
            >
              <Viewer
                fileUrl={fileUrl}
                defaultScale={SpecialZoomLevel.PageFit}
                renderPage={renderPage}
              />
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
        <EditModal data={unscaledSelections} url={fileUrl} id={data?.ID}>
          {({ openModal }) => (
            <Button
              variant="yellow"
              size="base"
              className="min-h-8 max-w-24 px-9 py-0.5"
              onClick={openModal}
            >
              Edit
            </Button>
          )}
        </EditModal>
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
