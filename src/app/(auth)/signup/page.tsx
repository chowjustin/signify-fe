"use client";

import Button from "@/components/buttons/Button";
import Input from "@/components/form/Input";
import UploadFile from "@/components/form/UploadFile";
import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import api from "@/lib/api";
import { ApiError } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type SignUpRequest = {
  name: string;
  username: string;
  email: string;
  password: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  file: any;
};

export default function SignUp() {
  const methods = useForm<SignUpRequest>({
    mode: "onChange",
  });

  const { handleSubmit } = methods;
  const router = useRouter();

  const { mutate: SignUpMutation, isPending } = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    SignUpRequest
  >({
    mutationFn: async (data: SignUpRequest) => {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);

      if (data.file && data.file[0]) {
        formData.append("file", data.file[0]);
      }

      return await api.post("/users/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (_, variables) => {
      const { username } = variables;
      toast.success("Berhasil melakukan registrasi!");
      router.push(`/verify?username=${encodeURIComponent(username)}`);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit: SubmitHandler<SignUpRequest> = (data) => {
    SignUpMutation(data);
    return;
  };

  return (
    <section className="p-6 max-md:p-2 w-full relative flex items-center justify-center h-screen">
      <div className="absolute p-6 max-md:p-2 -z-10 top-0">
        <NextImage
          src="/signup/bg.png"
          width={2000}
          height={2000}
          alt="background"
          className="w-full h-fit rounded-[15px] max-h-[45dvh] overflow-hidden"
          imgClassName="w-full h-full"
        />
      </div>
      <div className="bg-white shadow-md h-fit absolute z-10 max-h-[85dvh] max-md:min-h-[85dvh] custom-scrollbar rounded-[15px] max-md:px-6 max-md:py-8 px-[50px] py-12 w-full xl:max-w-[30%] md:max-w-[60%] max-w-[75%]">
        <FormProvider {...methods}>
          <Typography
            as="h2"
            variant="p"
            className="mb-[10px] text-center"
            weight="bold"
          >
            Register
          </Typography>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full h-full items-center"
          >
            <div className="space-y-4 pr-2 max-h-[60dvh] max-md:min-h-[60dvh] overflow-auto w-full custom-scrollbar">
              <Input
                id="name"
                label="Nama"
                placeholder="Nama"
                validation={{ required: "Nama harus diisi" }}
              />
              <Input
                id="username"
                label="Username"
                placeholder="Username"
                validation={{ required: "Username harus diisi" }}
              />
              <Input
                id="email"
                label="Email"
                placeholder="Email"
                validation={{
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Email tidak valid",
                  },
                  required: "Email Harus Diisi",
                }}
              />
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
              <div>
                <UploadFile
                  label="Upload File"
                  id="file"
                  maxSize={2000000}
                  helperText="Format file .jpeg .jpg .png .pdf, maksimum 2 MB"
                  validation={{ required: "This field is required" }}
                />
              </div>
            </div>
            <div className="w-full h-full flex flex-col items-center gap-3 max-md:gap-1">
              <Button
                variant="primary"
                type="submit"
                onClick={handleSubmit(onSubmit)}
                size="lg"
                className="w-full"
                isLoading={isPending}
              >
                Sign Up
              </Button>
              <Typography variant="sm" className="max-md:text-[12px]">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="font-bold text-primary hover:text-hover active:text-active"
                >
                  Sign In
                </Link>
              </Typography>
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
}
