"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryOptions,
} from "@tanstack/react-query";
import * as React from "react";
import { Toaster } from "react-hot-toast";

import api from "@/lib/api";
import Loading from "@/app/loading";

const defaultQueryFn = async ({ queryKey }: QueryOptions) => {
  const { data } = await api.get(`${queryKey?.[0]}`);
  return data;
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
    </QueryClientProvider>
  );
}
