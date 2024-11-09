"use client";
import {
  useForm,
  FormProvider,
  SubmitHandler,
  useWatch,
} from "react-hook-form";
import SelectableInput from "@/components/form/SelectableInput";
import { usePathname, useRouter } from "next/navigation";
import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiError } from "@/types/api";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Typography from "@/components/Typography";
import Input from "@/components/form/Input";
import UploadFile from "@/components/form/UploadFile";
import Button from "@/components/buttons/Button";
import LabelText from "@/components/form/LabelText";
import NextImage from "@/components/NextImage";
import BreadCrumbs from "@/components/BreadCrumbs";
import TextArea from "@/components/form/TextArea";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { RenderPageProps } from "@react-pdf-viewer/core";
import { useState } from "react";
import { AcceptModal } from "./modal/acceptModal";
import { RejectModal } from "./modal/rejectModal";

type SignUpRequest = {
  name: string;
  username: string;
  email: string;
  password: string;
  file: FileList | null;
};

export default function TambahAjuan() {
  const methods = useForm<SignUpRequest>({ mode: "onChange" });

  const path = usePathname();
  const pathId = path.split("/").pop();

  const { data } = useQuery({
    queryKey: ["detail", pathId],
    queryFn: async () => {
      const response = await api.get(`/sign/${pathId}`);
      return response.data.data;
    },
  });

  const statusPending = data?.Status === "Pending" ? true : false;
  const isSender = data?.IsSender === true ? true : false;

  const { handleSubmit, control } = methods;

  const breadCrumbs = [
    { href: "/dashboard", Title: "Dashboard" },
    { href: `/dashboard/${pathId}`, Title: "Detail" },
  ];

  const router = useRouter();
  // Watch for file upload changes
  const file = useWatch({ control, name: "file" });
  const [coordinates, setCoordinates] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const handlePageClick = (e: React.MouseEvent, page: HTMLElement) => {
    if (page instanceof HTMLElement) {
      const rect = page.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCoordinates({ x, y });
    }
  };
  const renderPage = (props: RenderPageProps) => {
    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          cursor: "crosshair",
          zIndex: 100,
        }}
        onClick={(e) => handlePageClick(e, e.currentTarget)}
      >
        {props.canvasLayer.children}
      </div>
    );
  };
  const { mutate: SignUpMutation, isPending } = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    SignUpRequest
  >({
    mutationFn: async (data: SignUpRequest) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (data.file && data.file[0]) {
        formData.append("file", data.file[0]);
      }
      return await api.post("/users/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Berhasil melakukan registrasi!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  const onSubmit: SubmitHandler<SignUpRequest> = (data) => {
    SignUpMutation(data);
  };
  // const fileUrl = file?.[0] ? URL.createObjectURL(file[0]) : null;
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
        <LabelText labelTextClasname="mt-8 mb-4">File Preview</LabelText>
        <div className="lg:w-[75%] w-full 2xl:w-[50%] bg-gray-100 h-[80dvh] p-4 border-3 border-primary border-dashed rounded-lg overflow-auto">
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
