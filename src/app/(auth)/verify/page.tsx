"use client";

import * as React from "react";

import Button from "@/components/buttons/Button";
import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import {
  FormProvider,
  useForm,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import { useRef } from "react";
import toast from "react-hot-toast";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useSearchParams } from "next/navigation";
import withAuth from "@/components/hoc/withAuth";

type VerificationCode = {
  code: string[];
};

type VerifyData = {
  username: string;
  code: string;
};

export default withAuth(Verify, "login");
function Verify() {
  const methods = useForm<VerificationCode>({
    defaultValues: { code: Array(6).fill("") },
    mode: "onChange",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "";

  React.useEffect(() => {
    if (!username) {
      router.replace("/signin");
    }
  }, [username, router]);

  const { handleSubmit, control, setValue, watch } = methods;
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target;

    if (/^\d*$/.test(value)) {
      setValue(`code.${index}`, value);
      const nextInput = inputsRef.current[index + 1];
      if (nextInput && value) nextInput.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !watch(`code.${index}`) && index > 0) {
      const prevInput = inputsRef.current[index - 1];
      if (prevInput) prevInput.focus();
    }
  };

  const setInputRef = (index: number, el: HTMLInputElement | null) => {
    inputsRef.current[index] = el;
  };

  const { mutate: VerifyMutation, isPending } = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    VerifyData
  >({
    mutationFn: async (data: VerifyData) => {
      return await api.post("/users/verify", data);
    },
    onSuccess: () => {
      toast.success("Email berhasil diverifikasi!");
      router.push("/signin");
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage);
    },
  });

  const onSubmit: SubmitHandler<VerificationCode> = (data) => {
    const code = data.code.join("");
    const verifyData: VerifyData = {
      username,
      code,
    };
    VerifyMutation(verifyData);
    return;
  };

  return (
    <section className="p-6 max-md:p-2 w-full h-full">
      <div className="max-h-[45vh] rounded-[15px] overflow-hidden">
        <NextImage
          src="/signup/bg.png"
          width={2000}
          height={2000}
          alt="background"
          className="w-full h-fit"
          imgClassName="w-full h-full"
        />
      </div>
      <div className="bg-white shadow-md h-fit absolute z-10 top-1/2 max-h-[85vh] custom-scrollbar -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-[15px] max-md:px-6 max-md:py-8 px-[50px] py-12 w-full xl:max-w-[30%] md:max-w-[60%] max-w-[85%]">
        <Typography variant="p" className="mb-[32px] text-center" weight="bold">
          Verify Your Email
        </Typography>
        <Typography variant="sm" className="mb-[20px] text-center">
          Email verifikasi sudah dikirim ke email registrasi Anda, Tolong
          masukkan code di bawah untuk melanjutkan registrasi
        </Typography>
        <hr />
        <Typography variant="sm" className="mt-[20px] mb-[20px] text-center">
          Masukkan kode verifikasi
        </Typography>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full h-full items-center"
          >
            <div className="flex gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Controller
                  key={index}
                  name={`code.${index}`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      ref={(el) => setInputRef(index, el)}
                      type="number"
                      maxLength={1}
                      className="w-12 h-12 max-sm:w-8 max-sm:h-8 border border-gray-300 rounded-md text-center text-xl focus:ring-2 focus:ring-primary focus:outline-none"
                      onChange={(e) => handleInput(index, e)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                    />
                  )}
                />
              ))}
            </div>
            <Button
              variant="primary"
              size="lg"
              type="submit"
              className="w-full mt-5"
              onClick={handleSubmit(onSubmit)}
              isLoading={isPending}
            >
              Verify
            </Button>
          </form>
        </FormProvider>
      </div>
    </section>
  );
}
