import { getSession } from "@/features/auth/utils";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  if (session) redirect("/dashboard/blog/new");
  return children;
}
