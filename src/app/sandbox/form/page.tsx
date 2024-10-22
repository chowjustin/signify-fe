"use client";

import { FormProvider, useForm } from "react-hook-form";

import Input from "@/components/form/Input";

export default function FormSandbox() {
  const methods = useForm();

  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col">
        <FormProvider {...methods}>
          <form className="w-[600px] flex flex-col gap-4">
            <Input id="Test" label="Username Tujuan" placeholder="Username" />
            <Input
              id="Test"
              label="Username Tujuan"
              placeholder="Username"
              readOnly
            />
          </form>
        </FormProvider>
      </div>
    </main>
  );
}
