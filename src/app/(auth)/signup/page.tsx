"use client";

import { useState } from "react";
import Button from "@/components/buttons/Button";
import Input from "@/components/form/Input";
import UploadFile from "@/components/form/UploadFile";
import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import SignatureCanvas from "./SignatureCanvas";
import api from "@/lib/api";
import { ApiError } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import LabelText from "@/components/form/LabelText";

type SignUpRequest = {
  name: string;
  username: string;
  email: string;
  password: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  file: any;
};

export default function SignUp() {
  const [selectedTab, setSelectedTab] = useState<"file" | "canvas">("file");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isCanvasDrawn, setIsCanvasDrawn] = useState(false);

  const methods = useForm<SignUpRequest>({
    mode: "onChange",
  });
  const { handleSubmit, setValue } = methods;
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
      } else if (data.file) {
        formData.append("file", data.file);
      }

      return await api.post("/users/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: (_, variables) => {
      const { username } = variables;
      toast.success("Registration successful!");
      router.push(`/verify?username=${encodeURIComponent(username)}`);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit: SubmitHandler<SignUpRequest> = (data) => {
    if (selectedTab === "canvas" && !isCanvasDrawn) {
      toast.error("Please draw your signature before submitting!");
      return;
    }

    SignUpMutation(data);
  };

  const handleFileUpload = () => {
    setIsFileUploaded(true);
  };

  const handleCanvasDrawing = (file: File | null) => {
    if (file) {
      setIsCanvasDrawn(true);
      setIsFileUploaded(false);
    }
    setValue("file", file);
  };

  return (
    <section className="p-6 max-md:p-2 w-full relative flex items-center justify-center h-screen">
      <div className="absolute p-6 max-md:p-2 -z-10 top-0">
        <NextImage
          src="/signup/bg.png"
          width={2000}
          height={2000}
          alt="background"
          priority
          className="w-full h-fit rounded-[15px] max-h-[45vh] overflow-hidden"
          imgClassName="w-full h-full"
        />
      </div>
      <div className="bg-white shadow-md h-fit absolute z-10 max-h-[85vh] max-md:min-h-[85vh] custom-scrollbar rounded-[15px] max-md:px-6 max-md:py-8 px-[50px] py-12 w-full xl:max-w-[30%] md:max-w-[60%] max-w-[75%]">
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
            <div className="space-y-4 pr-2 max-h-[60vh] max-md:min-h-[60vh] overflow-auto w-full custom-scrollbar">
              <Input
                id="name"
                label="Name"
                placeholder="Name"
                validation={{ required: "Name is required" }}
              />
              <Input
                id="username"
                label="Username"
                placeholder="Username"
                validation={{ required: "Username is required" }}
              />
              <Input
                id="email"
                label="Email"
                placeholder="Email"
                validation={{
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email",
                  },
                  required: "Email is required",
                }}
              />
              <Input
                id="password"
                type="password"
                label="Password"
                placeholder="Password"
                validation={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
              />

              <LabelText labelTextClasname="mt-4 -mb-2">
                Choose Signing Method
              </LabelText>
              <div className="tabs flex gap-2 mb-6 mt-4">
                <Button
                  type="button"
                  size="sm"
                  variant={`${selectedTab === "file" ? "primary" : "outline"}`}
                  onClick={() => {
                    if (!isFileUploaded) {
                      setSelectedTab("file");
                    }
                  }}
                  disabled={isCanvasDrawn}
                  className={`tab rounded-lg transition-all duration-300 text-sm font-semibold px-2 ${
                    selectedTab === "file"
                      ? ""
                      : "disabled:cursor-not-allowed disabled:opacity-50"
                  }`}
                >
                  Upload File
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (!isFileUploaded) {
                      setSelectedTab("canvas");
                    }
                  }}
                  variant={`${
                    selectedTab === "canvas" ? "primary" : "outline"
                  }`}
                  disabled={isFileUploaded}
                  className={`tab rounded-lg transition-all duration-300 text-sm font-semibold px-2 ${
                    selectedTab === "canvas"
                      ? ""
                      : "disabled:cursor-not-allowed disabled:opacity-50"
                  }`}
                >
                  Draw Signature
                </Button>
              </div>

              {selectedTab === "file" && (
                <UploadFile
                  id="file"
                  maxSize={2000000}
                  accept={{ "image/*": [".jpg", ".jpeg", ".png"] }}
                  maxFiles={1}
                  helperText="File formats .jpeg .jpg .png, maximum size 2 MB"
                  onFileUpload={handleFileUpload}
                  validation={{ required: "This field is required" }}
                  disabled={isCanvasDrawn}
                />
              )}
              {selectedTab === "canvas" && (
                <SignatureCanvas
                  onSignatureChange={handleCanvasDrawing}
                  disabled={isFileUploaded}
                />
              )}
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
