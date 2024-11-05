"use client";
import { useDisclosure } from "@nextui-org/react";
import { FiAlertTriangle } from "react-icons/fi";
import Button from "@/components/buttons/Button";
import Modal from "./Modal";
import { removeToken } from "@/lib/cookies";
import { useRouter } from "next/navigation";
import Typography from "../Typography";

type ModalReturnType = {
  openModal: () => void;
};

export function LogOut({
  children,
}: {
  children: (props: ModalReturnType) => JSX.Element;
}) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const modalReturn: ModalReturnType = {
    openModal: onOpen,
  };

  const router = useRouter();

  return (
    <>
      {children(modalReturn)}

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="opaque"
        backdropClassName="bg-[#17171F] bg-opacity-60"
        className="w-[90%] md:w-[400px] flex mx-auto border-none relative z-[100]"
      >
        <Modal.Header
          className="flex justify-center mt-10"
          onClose={onClose}
          buttonCrossClassName="mt-[10px] mr-[10px]"
        >
          <div className="rounded-full p-2 bg-danger-100">
            <div className="p-2 rounded-full bg-danger-200">
              <FiAlertTriangle className="text-2xl text-danger-700" />
            </div>
          </div>
        </Modal.Header>

        <Modal.Body className="text-center px-10 mt-5">
          <h1 className="text-[#1F2937]">
            <Typography variant="h6" weight="bold">
              Peringatan!
            </Typography>
          </h1>
          <p className="text-[#6B7280] -mt-2">
            Apakah anda yakin ingin log out?
          </p>
        </Modal.Body>

        <Modal.Footer className="mt-5 mb-8">
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="base"
              className="min-h-8 max-w-24 px-9 py-0.5"
              onClick={onClose}
            >
              Tidak
            </Button>
            <Button
              variant="primary"
              size="base"
              className="min-h-8 max-w-24 px-9 py-0.5"
              onClick={() => {
                removeToken();
                onClose();
                router.replace("/signin");
              }}
            >
              Ya
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
