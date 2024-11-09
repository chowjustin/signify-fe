"use client";

import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Button from "@/components/buttons/Button";
import LabelText from "@/components/form/LabelText";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { useEffect, useRef, useState } from "react";

import Modal from "@/components/modal/Modal";

import { SubmitModal } from "@/components/modal/variants/submitModal";
import { useDisclosure } from "@nextui-org/modal";

type ModalReturnType = {
  openModal: () => void;
};

type EditData = {
  id: string;
  x: string;
  y: string;
  w: string;
  password: string;
  confirmpassword?: string;
};

export function EditModal({
  children,
  id,
  url,
}: {
  children: (props: ModalReturnType) => JSX.Element;
  id: string;
  url: string;
}) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const modalReturn: ModalReturnType = {
    openModal: onOpen,
  };
  const methods = useForm<EditData>({ mode: "onChange" });
  const { reset, handleSubmit } = methods;
  const [response, setResponse] = useState("not submitted");

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

  const handlePageClick = (e: React.MouseEvent, page: HTMLElement) => {
    const rect = page.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSelection({ x, y, w: 0, height: 0 });
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

  const { mutate: updateMutation, isPending } = useMutation<
    AxiosResponse,
    AxiosError,
    EditData
  >({
    mutationFn: async (updatedData: EditData) => {
      return await api.patch(`/sign/modify`, updatedData);
    },
    onSuccess: () => {
      toast.success("Berhasil mengubah posisi tanda tangan!");
      setResponse("submitted");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit: SubmitHandler<EditData> = (data) => {
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

    data.x = scaledX.toFixed(0);
    data.y = scaledY.toFixed(0);
    data.w = scaledW.toFixed(0);
    data.id = id;

    updateMutation(data);
  };

  const fileUrl = url;

  return (
    <>
      {children(modalReturn)}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="opaque"
        scrollBehavior="inside"
        backdropClassName="bg-[#17171F] bg-opacity-60"
        className=" max-md:px-4 flex mx-auto border-none"
      >
        <Modal.Header
          className="flex mt-[30px] px-[30px]"
          onClose={onClose}
          buttonCrossClassName="hidden"
        >
          Edit Letak Tanda Tangan
        </Modal.Header>

        <Modal.Body className="text-left px-[30px] mt-[30px]">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 h-full mb-4"
            >
              <LabelText labelTextClasname="mt-4">
                Select Coordinates on the Preview
              </LabelText>
              <div className="w-full h-[50dvh] max-[450px]:h-[40dvh] max-[400px]:h-[35dvh] max-[350px]:h-[30dvh] bg-gray-100 mt-6 p-4 border-3 border-primary border-dashed rounded-lg overflow-auto">
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
              <div className="mt-4 text-gray-700">
                <LabelText>
                  Selected Coordinates: X: {selection?.x.toFixed(2)}, Y:{" "}
                  {selection?.y.toFixed(2)},{" "}
                  {isMdScreen && <>Width: {selection?.w.toFixed(2)}</>}
                </LabelText>
              </div>
            </form>
          </FormProvider>
        </Modal.Body>

        <Modal.Footer className="mt-5 mb-8">
          <div className="flex w-full justify-center gap-[10px] px-[30px]">
            <Button
              variant="outline"
              size="base"
              onClick={() => {
                reset();
                setSelection(null);
                onClose();
              }}
              className="w-1/2"
            >
              Batal
            </Button>
            <SubmitModal
              message="Berhasil menandatangani dokumen!"
              path="/dashboard"
              onSubmit={handleSubmit(onSubmit)}
              onReset={reset}
              response={response}
            >
              {({ openModal }) => (
                <Button
                  variant="primary"
                  size="base"
                  onClick={() => {
                    if (!selection) {
                      toast.error("Please select coordinates on the preview");
                    } else {
                      openModal();
                    }
                  }}
                  isLoading={isPending}
                  className="w-1/2"
                >
                  Simpan
                </Button>
              )}
            </SubmitModal>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
