"use client";

import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "@/components/buttons/Button";
import LabelText from "@/components/form/LabelText";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { useEffect, useRef, useState } from "react";

import Modal from "@/components/modal/Modal";

import { useDisclosure } from "@nextui-org/modal";
import { ModifyModal } from "./modifyModal";
import Input from "@/components/form/Input";
import useAuthStore from "@/app/stores/useAuthStore";
import { DraggableOverlay } from "./draggableOverlay";

type ModalReturnType = {
  openModal: () => void;
};

export type EditData = {
  id: string;
  x: string;
  y: string;
  w: string;
  password: string;
};

export function EditModal({
  children,
  data,
  url,
}: {
  children: (props: ModalReturnType) => JSX.Element;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data: any;
  url: string;
}) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const modalReturn: ModalReturnType = {
    openModal: onOpen,
  };
  const methods = useForm<EditData>({ mode: "onChange" });
  const { reset, handleSubmit } = methods;
  const { user } = useAuthStore();

  const [selection, setSelection] = useState<{
    x: number;
    y: number;
    w: number;
    height: number;
  } | null>(null);

  const [isMdScreen, setIsMdScreen] = useState(false);
  const [screenSize, setScreenSize] = useState(1440);

  useEffect(() => {
    const handleResize = () => {
      setIsMdScreen(window.innerWidth >= 768);
    };

    setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [width, setWidth] = useState(60);
  const [height, setHeight] = useState(35);

  const [modalData, setModalData] = useState<EditData>({
    id: "",
    x: "0",
    y: "0",
    w: "0",
    password: "",
  });
  const pageContainerRef = useRef<HTMLDivElement>(null);

  const handlePageClick = (e: React.MouseEvent, page: HTMLElement) => {
    const rect = page.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSelection({ x, y, w: width, height: height });
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const renderPage = (props: any) => (
    <div
      id="preview-page-modal"
      ref={pageContainerRef}
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
      onClick={
        !isMdScreen ? (e) => handlePageClick(e, e.currentTarget) : undefined
      }
    >
      {props.canvasLayer.children}

      {isMdScreen && user?.ttd && (
        <DraggableOverlay
          src={user.ttd}
          initialPosition={{
            x: data?.Position.x / (595 / 224) + 2,
            y: data?.Position.y / (842 / 316) + 4,
          }}
          initialSize={{
            width: data?.Position.w / (595 / 224),
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            height: "auto" as any,
          }}
          containerRef={pageContainerRef}
          onPositionChange={(pos) => {
            const page = pageContainerRef.current;
            if (!page) return;

            const rect = page.getBoundingClientRect();

            const scaleX = 595 / (screenSize >= 490 ? 227 : rect.width);
            const scaleY = 842 / (screenSize >= 490 ? 322 : rect.height);

            const scaledX = pos.x * scaleX;
            const scaledY = pos.y * scaleY;
            const scaledW = pos.width * scaleX;

            setSelection({
              x: pos.x,
              y: pos.y,
              w: pos.width,
              // height: pos.height || 0,
              height: 50,
            });

            setModalData((prev) => ({
              ...prev,
              x: scaledX.toFixed(0),
              y: scaledY.toFixed(0),
              w: scaledW.toFixed(0),
            }));
          }}
        />
      )}

      {!isMdScreen && selection && user?.ttd && (
        <div
          style={{
            position: "absolute",
            left: selection.x,
            top: selection.y,
            width: selection.w,
            pointerEvents: "none",
          }}
        >
          <img
            src={user.ttd}
            alt="ttd"
            style={{
              width: "100%",
            }}
          />
        </div>
      )}
    </div>
  );

  const onSubmit: SubmitHandler<EditData> = () => {
    if (!selection) {
      toast.error("Please select coordinates on the preview");
      return;
    }

    const page = document.getElementById("preview-page-modal");
    if (!page) return;

    const rect = page.getBoundingClientRect();

    const scaleX = 595 / (screenSize >= 768 ? 227 : rect.width);
    const scaleY = 842 / (screenSize >= 768 ? 322 : rect.height);

    const scaledX = selection.x * scaleX;
    const scaledY = selection.y * scaleY;
    const scaledW = selection.w * scaleX;

    const preparedData: EditData = {
      id: data?.ID,
      x: scaledX.toFixed(0),
      y: scaledY.toFixed(0),
      w: scaledW.toFixed(0),
      password: "",
    };

    setModalData(preparedData);
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
        className=" flex max-md:px-4 mx-auto border-none"
      >
        <Modal.Header
          className="flex pt-[30px] px-[30px]"
          onClose={onClose}
          buttonCrossClassName="hidden"
        >
          Edit Letak Tanda Tangan
        </Modal.Header>

        <Modal.Body className="text-left px-[30px] pt-[30px] min-h-[130px]">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 h-full mb-4"
            >
              <LabelText labelTextClasname="mt-4">
                Select Coordinates <span className="md:hidden">Area Size</span>
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
                </div>
                <span className="max-md:hidden">on the Preview</span>
              </LabelText>
              <div className="w-full h-[45vh] bg-gray-100 mt-6 p-4 border-3 border-primary border-dashed rounded-lg overflow-auto">
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
                  {selection?.y.toFixed(2)}, Width: {selection?.w.toFixed(2)}
                </LabelText>
              </div>
            </form>
          </FormProvider>
        </Modal.Body>

        <Modal.Footer className="pt-5 pb-8">
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
            <ModifyModal data={modalData}>
              {({ openModal }) => (
                <Button
                  variant="primary"
                  size="base"
                  onClick={() => {
                    if (!selection) {
                      toast.error("Please select coordinates on the preview");
                    } else {
                      onSubmit(modalData);
                      openModal();
                    }
                  }}
                  className="w-1/2"
                >
                  Simpan
                </Button>
              )}
            </ModifyModal>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
