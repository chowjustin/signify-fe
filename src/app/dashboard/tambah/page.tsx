"use client";

import {
  useForm,
  FormProvider,
  SubmitHandler,
  useWatch,
} from "react-hook-form";
import SelectableInput from "@/components/form/SelectableInput";
import { useRouter } from "next/navigation";
import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
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

type SignUpRequest = {
  name: string;
  username: string;
  email: string;
  password: string;
  file: FileList | null;
};

const breadCrumbs = [
  { href: "/dashboard", Title: "Dashboard" },
  { href: "/dashboard/profile", Title: "Profil" },
];

export default function TambahAjuan() {
  const methods = useForm<SignUpRequest>({ mode: "onChange" });

  const { handleSubmit, control } = methods;
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

  const fileUrl = file?.[0] ? URL.createObjectURL(file[0]) : null;

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
            Tambah Ajuan Tanda Tangan
          </span>
        </div>
      </div>
      <div className="flex justify-between gap-6">
        <div className="w-[40%]">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col w-full mt-6 h-full"
            >
              <LabelText required>Masukkan Username Tujuan</LabelText>
              <div className="space-y-4">
                <SelectableInput
                  id="username"
                  title="Username"
                  errorMessage="Username Tujuan harus diisi"
                />
                <Input
                  id="title"
                  label="Topik"
                  placeholder="Topik Surat"
                  validation={{ required: "Topik surat harus diisi" }}
                />
                <div>
                  <UploadFile
                    label="Upload Surat"
                    id="file"
                    maxSize={2000000}
                    helperText="Format file .pdf, maksimum 2 MB"
                    validation={{ required: "File surat wajib diupload" }}
                  />
                </div>
                <TextArea
                  id="coverletter"
                  label="Cover Letter"
                  placeholder="Cover Letter"
                  className="min-h-[200px]"
                />
              </div>
              {coordinates && (
                <div className="mt-4 text-gray-700">
                  <LabelText>
                    Selected Coordinates: X: {coordinates.x.toFixed(2)}, Y:{" "}
                    {coordinates.y.toFixed(2)}
                  </LabelText>
                </div>
              )}

              <div className="mt-4 w-full flex justify-center overflow-y-auto">
                <Button
                  variant="primary"
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  size="base"
                  className=""
                  isLoading={isPending}
                >
                  Ajukan
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
        {/* File Preview */}
        <div className="w-[50%] bg-gray-100 h-[80dvh] mt-6 p-4 border-3 border-primary border-dashed rounded-lg overflow-auto">
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
    </section>
  );
}
