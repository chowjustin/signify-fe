"use client";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import Input from "@/components/form/Input";
import UploadImage from "@/components/form/UploadImage";
import Button from "@/components/buttons/Button";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ApiError, ApiResponse } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import useAuthStore from "@/app/stores/useAuthStore";

export default function FormSandbox() {
  const methods = useForm();

  const { handleSubmit } = methods;

  const { user } = useAuthStore();

  const { mutate: handleImageUpload, isPending } = useMutation<
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    any,
    ApiError,
    FormData
  >({
    mutationFn: async (data) => {
      await axios;
      api
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
    // Prepare the FormData object
    const formData = new FormData();

    // Append the image file from react-hook-form
    if (data.image && data.image[0]) {
      formData.append("file", data.image[0]); // data.image[0] is the uploaded image file
    }

    // Trigger the mutation to upload the image
    handleImageUpload(formData);
    // console.log(data);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col">
        <FormProvider {...methods}>
          <form
            className="w-[600px] flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* <Input id="Test" label="Username Tujuan" placeholder="Username" />
            <Input
              id="Test"
              label="Username Tujuan"
              placeholder="Username"
              readOnly
            /> */}
            <div>
              <UploadImage
                label="Upload Image"
                id="image"
                maxSize={2000000}
                helperText="Format file .jpeg .jpg .png, maksimum 2 MB"
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
