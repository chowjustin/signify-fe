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

export type ModifyRequest = {
  id: string;
  positions: AreaSelection[];
  password: string;
};

type AreaSelection = {
  page: number;
  x: number;
  y: number;
  w: number;
};

export function EditModal({
  children,
  data,
  url,
  id,
}: {
  children: (props: ModalReturnType) => JSX.Element;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data: any;
  id: string;
  url: string;
}) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const modalReturn: ModalReturnType = {
    openModal: onOpen,
  };
  const methods = useForm<ModifyRequest>({ mode: "onChange" });
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

  const [modalData, setModalData] = useState<ModifyRequest>({
    id: "",
    positions: [],
    password: "",
  });
  const pageContainerRef = useRef<HTMLDivElement>(null);

  const handlePageClick = (e: React.MouseEvent, page: HTMLElement) => {
    const rect = page.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSelection({ x, y, w: width, height: height });
  };

  const [initialPositions, setInitialPositions] = useState<
    Array<{
      page: number;
      x: number;
      y: number;
      w: number;
    }>
  >([]);

  useEffect(() => {
    // Initialize initial positions when data loads
    if (data) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const initialPosition = data.map((position: any) => ({
        page: position.page,
        x: position.x,
        y: position.y,
        w: position.w,
      }));
      setInitialPositions(initialPosition);
    }
  }, [data]);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const renderPage = (props: any) => {
    const page = props.pageIndex + 1;

    return (
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

        {isMdScreen &&
          user?.ttd &&
          data?.map(
            (
              position: {
                page: number;
                x: number;
                y: number;
                w: number;
              },
              index: number,
            ) =>
              position.page === page && (
                <DraggableOverlay
                  key={`draggable-${index}`}
                  src={user.ttd}
                  initialPosition={{
                    x: position.x / (595 / 224),
                    y: position.y / (842 / 316),
                  }}
                  initialSize={{
                    width: position.w / (595 / 224),
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    height: "auto" as any,
                  }}
                  containerRef={pageContainerRef}
                  onPositionChange={(pos) => {
                    const pageContainer = pageContainerRef.current;
                    if (!pageContainer) return;

                    const rect = pageContainer.getBoundingClientRect();

                    const scaleX = 595 / (screenSize >= 490 ? 227 : rect.width);
                    const scaleY =
                      842 / (screenSize >= 490 ? 322 : rect.height);

                    const scaledX = pos.x * scaleX;
                    const scaledY = pos.y * scaleY;
                    const scaledW = pos.width * scaleX;

                    // Update the specific position in the data
                    const updatedPositions = data.map(
                      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                      (p: any, i: number) =>
                        i === index
                          ? {
                              ...p,
                              x: scaledX,
                              y: scaledY,
                              w: scaledW,
                            }
                          : p,
                    );

                    setInitialPositions(updatedPositions);
                    // Update the state or data with new positions
                    // You might need to add a state update method here
                    // setData(prevData => ({
                    //   ...prevData,
                    //   Positions: updatedPositions
                    // }));

                    setSelection({
                      x: pos.x,
                      y: pos.y,
                      w: pos.width,
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
              ),
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
              src={user?.ttd}
              alt="ttd"
              style={{
                width: "100%",
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const onSubmit: SubmitHandler<ModifyRequest> = () => {
    // if (!selection) {
    //   toast.error("Please select coordinates on the preview");
    //   return;
    // }

    // const page = document.getElementById("preview-page-modal");
    // if (!page) return;

    // const rect = page.getBoundingClientRect();

    // const scaleX = 595 / (screenSize >= 768 ? 227 : rect.width);
    // const scaleY = 842 / (screenSize >= 768 ? 322 : rect.height);

    // const scaledX = selection.x * scaleX;
    // const scaledY = selection.y * scaleY;
    // const scaledW = selection.w * scaleX;
    const finalPosition = initialPositions.map((selection) => ({
      page: selection.page,
      x: Math.round(selection.x),
      y: Math.round(selection.y),
      w: Math.round(selection.w),
      // height: (selection.height * scaleY).toFixed(0),
    }));

    const preparedData: ModifyRequest = {
      id: id,
      positions: finalPosition,
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
                    onSubmit(modalData);
                    openModal();
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
