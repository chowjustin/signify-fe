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
import { removeToken } from "@/lib/cookies";
import axios from "axios";

type ModalReturnType = {
  openModal: () => void;
};

type DeleteData = {
  password: string;
  confirmpassword?: string;
};

export function DeleteUserModal({
  children,
}: {
  children: (props: ModalReturnType) => JSX.Element;
}) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const modalReturn: ModalReturnType = {
    openModal: onOpen,
  };

  const [response, setResponse] = useState("not submitted");
  const isPending = false;

  const methods = useForm<DeleteData>({
    mode: "onChange",
  });

  const { reset, handleSubmit } = methods;

  const deleteMutation = useMutation({
    mutationFn: async (updatedData: DeleteData) => {
      return await api.delete(`/users/`, {
        data: updatedData,
      });
    },
    onSuccess: () => {
      toast.success("Berhasil menghapus user!");
      setResponse("submitted");
    },
    onError: () => {
      toast.error("Password salah!");
    },
  });

  const onSubmit = (formData: DeleteData) => {
    const { confirmpassword, ...updatedData } = formData;
    deleteMutation.mutate(updatedData);
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
        className="md:min-w-[400px] w-full max-md:px-4 flex mx-auto border-none"
      >
        <Modal.Header
          className="flex pt-[30px] px-[30px]"
          onClose={onClose}
          buttonCrossClassName="hidden"
        >
          Konfirmasi untuk Menghapus User
        </Modal.Header>

        <Modal.Body className="text-left px-[30px] pt-[30px] min-h-[110px]">
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
                <Input
                  id="confirmpassword"
                  type="password"
                  label="Konfirmasi Password"
                  placeholder="Konfirmasi Password"
                  validation={{
                    required: "Konfirmasi Password Harus Diisi",
                    minLength: {
                      value: 6,
                      message: "Password Minimal 6 Karakter",
                    },
                    validate: (value, { password }) =>
                      value === password || "Password Tidak Cocok",
                  }}
                />
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
                onClose();
              }}
              className="w-1/2"
            >
              Batal
            </Button>
            <SubmitModal
              message="Berhasil menghapus user!"
              path="/signup"
              onSubmit={handleSubmit(onSubmit)}
              onReset={removeToken}
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
