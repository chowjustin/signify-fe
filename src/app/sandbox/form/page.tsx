"use client";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import UploadFile from "@/components/form/UploadFile";
import Button from "@/components/buttons/Button";
import { ApiError } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Input } from "@nextui-org/react";

export default function FormSandbox() {
  const methods = useForm();

  const { handleSubmit } = methods;

  const { mutate: handleImageUpload } = useMutation<
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    any,
    ApiError,
    FormData
  >({
    mutationFn: async (data) => {
      await api
        .post("/users/file", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          // const data = res.data.data;
          toast.success("File uploaded!");
          return res;
        });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const onSubmit: SubmitHandler<any> = (data) => {
    const formData = new FormData();

    if (data.image && data.image[0]) {
      formData.append("file", data.image[0]);
    }

    handleImageUpload(formData);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col">
        <FormProvider {...methods}>
          <form
            className="w-[600px] flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input id="Test" label="Username Tujuan" placeholder="Username" />
            <Input
              id="Test"
              label="Username Tujuan"
              placeholder="Username"
              readOnly
            />
            <div>
              <UploadFile
                label="Upload File"
                id="image"
                maxSize={2000000}
                helperText="Format file .jpeg .jpg .png .pdf, maksimum 2 MB"
                validation={{ required: "This field is required" }}
              />
            </div>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </form>
        </FormProvider>
      </div>
    </main>
  );
}
