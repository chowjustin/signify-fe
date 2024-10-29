"use client";

import Button from "@/components/buttons/Button";
import Input from "@/components/form/Input";
import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import { LoginRequest } from "@/types/login";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import useLoginMutation from "./hooks/useLoginMutation";
import withAuth from "@/components/hoc/withAuth";

export default withAuth(SignIn, "login");
function SignIn() {
  const methods = useForm<LoginRequest>({
    mode: "onChange",
  });

  const { handleSubmit } = methods;

  const { mutate: mutateLogin, isPending } = useLoginMutation();
  const onSubmit = (data: LoginRequest) => {
    mutateLogin(data);
  };

  return (
    <section className="w-full h-screen flex max-md:items-center">
      <div className="w-1/2 max-md:w-full max-md:px-6 flex flex-col items-center justify-center">
        <Typography
          variant="h5"
          className="text-center text-primary max-md:text-[24px]"
          weight="bold"
        >
          Welcome Back
        </Typography>
        <Typography
          variant="sm"
          className="text-center mb-9 text-[#A0AEC0]"
          weight="bold"
        >
          Enter your email and password to sign in
        </Typography>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-1/2 space-y-6 max-lg:w-3/4 max-md:w-full "
          >
            <Input
              id="username"
              label="Username"
              placeholder="Username"
              validation={{ required: "Username harus diisi" }}
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

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleSubmit(onSubmit)}
              isLoading={isPending}
            >
              Sign In
            </Button>
            <Typography
              variant="sm"
              className="max-md:text-[12px] flex justify-center gap-1"
            >
              Don't have an account?
              <Link
                href="/signup"
                className="font-bold text-primary hover:text-hover active:text-active"
              >
                Sign Up
              </Link>
            </Typography>
          </form>
        </FormProvider>
      </div>
      <div className="w-1/2 h-[85vh] rounded-bl-[15px] relative overflow-hidden max-md:hidden">
        <NextImage
          src="/bg.png"
          width={2000}
          height={2000}
          alt="background"
          className="w-full h-full"
          imgClassName="w-full h-full"
        />
        <NextImage
          src="/Signify Logo White.png"
          width={1000}
          height={1000}
          alt="logo"
          className="w-[60%] z-10 absolute -translate-x-1/2 left-1/2 top-1/2 -translate-y-1/2"
        />
      </div>
    </section>
  );
}
