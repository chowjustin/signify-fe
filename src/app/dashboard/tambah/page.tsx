"use client";

import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import SelectableInput from "@/components/form/SelectableInput";
import { useRouter } from "next/navigation";
import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Input from "@/components/form/Input";
import UploadFile from "@/components/form/UploadFile";
import Button from "@/components/buttons/Button";
import LabelText from "@/components/form/LabelText";
import NextImage from "@/components/NextImage";
import BreadCrumbs from "@/components/BreadCrumbs";
import TextArea from "@/components/form/TextArea";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { useEffect, useRef, useState } from "react";

type SignUpRequest = {
  recipient: string;
  topic: string;
  cover_letter: string;
  x: string;
  y: string;
  document: FileList | null;
};

const breadCrumbs = [
  { href: "/dashboard", Title: "Dashboard" },
  { href: "/dashboard/profile", Title: "Profil" },
];

export default function TambahAjuan() {
  const methods = useForm<SignUpRequest>({ mode: "onChange" });
  const { handleSubmit } = methods;
  const router = useRouter();

  const [selection, setSelection] = useState<{
    x: number;
    y: number;
    w: number;
    height: number;
  } | null>(null);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [isMdScreen, setIsMdScreen] = useState(false);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMdScreen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent, page: HTMLElement) => {
    const rect = page.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPoint({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent, page: HTMLElement) => {
    if (startPoint) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      animationFrameId.current = requestAnimationFrame(() => {
        const rect = page.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const w = currentX - startPoint.x;
        const height = currentY - startPoint.y;

        setSelection({
          x: startPoint.x,
          y: startPoint.y,
          w,
          height,
        });
      });
    }
  };

  const handleMouseUp = () => {
    setStartPoint(null);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  const [width, setWidth] = useState(60);
  const [height, setHeight] = useState(35);

  const handlePageClick = (e: React.MouseEvent, page: HTMLElement) => {
    const rect = page.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSelection({ x, y, w: width, height: height });
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const renderPage = (props: any) => (
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
        cursor: isMdScreen ? "crosshair" : "default",
        zIndex: 100,
      }}
      onMouseDown={
        isMdScreen ? (e) => handleMouseDown(e, e.currentTarget) : undefined
      }
      onMouseMove={
        isMdScreen ? (e) => handleMouseMove(e, e.currentTarget) : undefined
      }
      onMouseUp={isMdScreen ? handleMouseUp : undefined}
      onClick={
        !isMdScreen ? (e) => handlePageClick(e, e.currentTarget) : undefined
      }
    >
      {props.canvasLayer.children}
      {isMdScreen && selection && (
        <div
          style={{
            position: "absolute",
            left: selection.x,
            top: selection.y,
            width: selection.w,
            height: selection.height,
            border: "2px dashed blue",
            backgroundColor: "rgba(0, 0, 255, 0.1)",
            pointerEvents: "none",
          }}
        />
      )}
      {!isMdScreen && selection && (
        <div
          style={{
            position: "absolute",
            left: selection.x,
            top: selection.y,
            width: selection.w,
            height: selection.height,
            border: "2px dashed red",
            backgroundColor: "rgba(255, 0, 0, 0.1)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );

  const { mutate: SignUpMutation, isPending } = useMutation<
    AxiosResponse,
    AxiosError,
    FormData
  >({
    mutationFn: async (formData: FormData) => {
      return await api.post("/sign/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Berhasil menambah ajuan!");
      router.replace("/dashboard");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit: SubmitHandler<SignUpRequest> = (data) => {
    if (!selection) {
      toast.error("Please select coordinates on the preview");
      return;
    }

    const page = document.getElementById("preview-page");
    if (!page) return;

    const rect = page.getBoundingClientRect();

    const scaleX = 595 / rect.width;
    const scaleY = 842 / rect.height;

    const scaledX = selection.x * scaleX;
    const scaledY = selection.y * scaleY;
    const scaledW = selection.w * scaleX;

    const formData = new FormData();
    formData.append("recipient", data.recipient);
    formData.append("topic", data.topic);
    formData.append("cover_letter", data.cover_letter);

    formData.append("x", scaledX.toFixed(0));
    formData.append("y", scaledY.toFixed(0));
    formData.append("w", scaledW.toFixed(0));

    if (data.document && data.document[0]) {
      formData.append("document", data.document[0]);
    }

    SignUpMutation(formData);
  };

  const [fileUrl, setFileUrl] = useState<string>("");

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleFileUpload = (files: any) => {
    if (files.length > 0) {
      setFileUrl(files[0].preview);
    }
  };

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
      <div className="flex justify-between gap-6 max-md:flex-col">
        <div className="w-[40%] max-md:w-full">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col w-full mt-6 h-full"
            >
              <LabelText required>Masukkan Username Tujuan</LabelText>
              <div className="space-y-4">
                <SelectableInput
                  id="recipient"
                  title="Username"
                  errorMessage="Username Tujuan harus diisi"
                />
                <Input
                  id="topic"
                  label="Topik"
                  placeholder="Topik Surat"
                  validation={{ required: "Topik surat harus diisi" }}
                />
                <div>
                  <UploadFile
                    label="Upload Surat"
                    id="document"
                    maxSize={2000000}
                    accept={{
                      "application/pdf": [".pdf"],
                    }}
                    maxFiles={1}
                    helperText="Format file .pdf, maksimum 2 MB"
                    validation={{ required: "File surat wajib diupload" }}
                    onFileUpload={handleFileUpload}
                  />
                </div>
                <LabelText labelTextClasname="mt-4">
                  Select Coordinates{" "}
                  <span className="md:hidden">Area Size</span>
                  <div className="md:hidden">
                    <div className="flex items-center mt-2 gap-2 w-[50%]">
                      Width:
                      <Input
                        id="width"
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(parseInt(e.target.value))}
                        className="px-2 py-1"
                      />
                    </div>
                    <div className="flex items-center gap-1 w-[50%]">
                      Height:
                      <Input
                        id="height"
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(parseInt(e.target.value))}
                        className="px-2 py-1"
                      />
                    </div>
                  </div>
                  <span className="max-md:hidden">on the Preview</span>
                </LabelText>
                <div className="w-full md:hidden h-[45vh] bg-gray-100 mt-6 p-4 border-3 border-primary border-dashed rounded-lg overflow-auto">
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
                    <p className="text-center text-gray-500">
                      File not uploaded
                    </p>
                  )}
                </div>

                <div className="mt-4 text-gray-700">
                  <LabelText>
                    Selected Coordinates: X: {selection?.x.toFixed(2)}, Y:{" "}
                    {selection?.y.toFixed(2)},{" "}
                    {isMdScreen && <>Width: {selection?.w.toFixed(2)}</>}
                  </LabelText>
                </div>

                <TextArea
                  id="cover_letter"
                  label="Cover Letter"
                  placeholder="Cover Letter"
                  className="min-h-[200px]"
                  validation={{ required: "Cover letter harus diisi" }}
                />
              </div>

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
        <div className="w-[50%] max-md:hidden max-md:h-full bg-gray-100 h-[80vh] mt-6 p-4 border-3 border-primary border-dashed rounded-lg overflow-auto">
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
