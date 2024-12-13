"use client";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import Button from "@/components/buttons/Button";
import Modal from "@/components/modal/Modal";
import Input from "@/components/form/Input";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { SubmitModal } from "@/components/modal/variants/submitModal";
import { EditData } from "./editModal";

type ModalReturnType = {
  openModal: () => void;
};

export function ModifyModal({
  children,
  data,
}: {
  children: (props: ModalReturnType) => JSX.Element;
  data: EditData;
}) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const modalReturn: ModalReturnType = {
    openModal: onOpen,
  };

  const [response, setResponse] = useState("not submitted");
  const isPending = false;

  const methods = useForm<EditData>({
    mode: "onChange",
  });

  const { reset, handleSubmit } = methods;

  const updateMutation = useMutation({
    mutationFn: async (updatedData: EditData) => {
      return await api.patch(`/sign/modify`, updatedData);
    },
    onSuccess: () => {
      setResponse("submitted");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (formData: EditData) => {
    formData.id = data.id;
    formData.x = data.x;
    formData.y = data.y;
    formData.w = data.w;
    updateMutation.mutate(formData);
  };

  return (
    <>
      {children(modalReturn)}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="opaque"
        scrollBehavior="inside"
        backdropClassName="bg-[#17171F] bg-opacity-60"
        className="w-full max-md:px-4 flex mx-auto border-none"
      >
        <Modal.Header
          className="flex mt-[30px] px-[30px]"
          onClose={onClose}
          buttonCrossClassName="hidden"
        >
          Tanda Tangan di Posisi Baru
        </Modal.Header>

        <Modal.Body className="text-left px-[30px] mt-[30px]">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 h-full mb-4"
            >
              <div className="flex flex-col space-y-5">
                <Input
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="Password"
                  validation={{
                    required: "Password Harus Diisi",
                    minLength: {
                      value: 6,
                      message: "Password Minimal 6 Karakter",
                    },
                  }}
                />
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
                onClose();
              }}
              className="w-1/2"
            >
              Batal
            </Button>
            <SubmitModal
              message="Berhasil menandatangani dokumen di posisi baru!"
              path="/dashboard"
              onSubmit={handleSubmit(onSubmit)}
              onReset={reset}
              response={response}
            >
              {({ openModal }) => (
                <Button
                  variant="primary"
                  size="base"
                  onClick={handleSubmit(() => {
                    openModal();
                  })}
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
