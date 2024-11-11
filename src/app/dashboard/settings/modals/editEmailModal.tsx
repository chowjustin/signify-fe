"use client";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import Button from "@/components/buttons/Button";
import Modal from "@/components/modal/Modal";
import Input from "@/components/form/Input";
import { User } from "@/types/user";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { SubmitModal } from "@/components/modal/variants/submitModal";
import { removeToken } from "@/lib/cookies";

type ModalReturnType = {
  openModal: () => void;
};

type ExtendedUser = User & { oldemail?: string };

export function EditEmailModal({
  children,
  data,
}: {
  children: (props: ModalReturnType) => JSX.Element;
  data: User | null;
}) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const modalReturn: ModalReturnType = {
    openModal: onOpen,
  };

  const [response, setResponse] = useState("not submitted");
  const isPending = false;

  const methods = useForm<ExtendedUser>({
    mode: "onChange",
  });

  const { reset, handleSubmit } = methods;

  const updateMutation = useMutation({
    mutationFn: async (updatedData: ExtendedUser) => {
      return await api.patch(`/users/`, updatedData);
    },
    onSuccess: () => {
      toast.success("Berhasil mengupdate Email!");
      setResponse("submitted");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (formData: ExtendedUser) => {
    const { oldemail, ...updatedData } = formData;
    updateMutation.mutate(updatedData);
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
          Edit Email
        </Modal.Header>

        <Modal.Body className="text-left px-[30px] pt-[30px] min-h-[110px]">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 h-full mb-4"
            >
              <div className="flex flex-col space-y-5">
                <Input
                  type="text"
                  id="oldemail"
                  label={"Email Lama"}
                  placeholder={"Email Lama"}
                  validation={{
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Email tidak valid",
                    },
                    required: "Email Lama Harus Diisi",
                  }}
                />

                <Input
                  type="text"
                  id="email"
                  label={"Email Baru"}
                  placeholder="Email Baru"
                  validation={{
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Email tidak valid",
                    },
                    required: "Email Baru Harus Diisi",
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
              message="Email berhasil diupdate!"
              path="/dashboard/profile"
              onSubmit={handleSubmit(onSubmit)}
              onReset={removeToken}
              response={response}
            >
              {({ openModal }) => (
                <Button
                  variant="primary"
                  size="base"
                  onClick={handleSubmit(() => {
                    const oldemail = methods.getValues("oldemail");

                    if (oldemail !== data?.email) {
                      toast.error("Email lama tidak sesuai!");
                      return;
                    }

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
