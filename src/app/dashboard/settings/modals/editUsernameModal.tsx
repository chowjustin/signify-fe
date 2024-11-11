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

type ModalReturnType = {
  openModal: () => void;
};

type ExtendedUser = User & { oldusername?: string };

export function EditUsernameModal({
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
      toast.success("Berhasil mengupdate username!");
      setResponse("submitted");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (formData: ExtendedUser) => {
    const { oldusername, ...updatedData } = formData;
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
          Edit Username
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
                  id="oldusername"
                  label={"Username Lama"}
                  placeholder={"Username Lama"}
                  validation={{ required: "Username Lama Harus Diisi" }}
                />

                <Input
                  type="text"
                  id="username"
                  label={"Username Baru"}
                  placeholder="Username Baru"
                  validation={{ required: "Username Baru Harus Diisi" }}
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
              message="Username berhasil diupdate!"
              path="/dashboard/profile"
              onSubmit={handleSubmit(onSubmit)}
              onReset={reset}
              response={response}
            >
              {({ openModal }) => (
                <Button
                  variant="primary"
                  size="base"
                  onClick={handleSubmit(() => {
                    const oldusername = methods.getValues("oldusername");

                    if (oldusername !== data?.username) {
                      toast.error("Username lama tidak sesuai!");
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
