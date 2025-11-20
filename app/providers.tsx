"use client";
import { QueryClientProvider } from "@tanstack/react-query";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type * as React from "react";
import { getQueryClient } from "./get-query-client";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/*<ReactQueryDevtools />*/}
    </QueryClientProvider>
  );
}
