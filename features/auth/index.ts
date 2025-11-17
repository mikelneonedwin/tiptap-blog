"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function redirectGuests() {
  const session = await getSession();
  if (!session) redirect("/editor/login");
}

export async function authorizeSession() {
  const session = await getSession();
  if (!session) unauthorized();
  return session;
}
