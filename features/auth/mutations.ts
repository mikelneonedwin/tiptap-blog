"use client";
// TODO callbackUrl
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { LoginFormSchema, SignupFormSchema } from "./schemas";

const toastId = "AUTH-TOAST";
const callbackURL = "/dashboard/blog/new";

export const useEmailLoginMutation = () =>
  useMutation({
    mutationFn: async (data: LoginFormSchema) => {
      await authClient.signIn.email({
        ...data,
        callbackURL,
      });
    },
    onMutate: () => {
      toast.loading("Logging in", {
        id: toastId,
      });
    },
    onSuccess: () => {
      toast.success("Welcome back!", {
        id: toastId,
      });
    },
    onError: (error) => {
      console.error("Error logging in via email:", error);
      toast.error("Sorry, an error occured", {
        id: toastId,
      });
    },
  });

export const useGitHubMutation = () =>
  useMutation({
    mutationFn: async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL,
      });
    },
    onMutate: () => {
      toast.loading("Continuing with GitHub", {
        id: toastId,
      });
    },
    onSuccess: () => {
      toast.success("Welcome!", {
        id: toastId,
      });
    },
    onError: (error) => {
      console.error("Error authenticating in via GitHub:", error);
      toast.error("Sorry, an error occured", {
        id: toastId,
      });
    },
  });

export const useEmailSignupMutation = () =>
  useMutation({
    mutationFn: async ({ confirmPassword: _, ...data }: SignupFormSchema) => {
      await authClient.signUp.email({
        ...data,
        callbackURL,
      });
    },
    onMutate: () => {
      toast.loading("Creating account", {
        id: toastId,
      });
    },
    onSuccess: () => {
      toast.success("Welcome aboard!", {
        id: toastId,
      });
    },
    onError: (error) => {
      console.error("Error creating account in via email:", error);
      toast.error("Sorry, an error occured", {
        id: toastId,
      });
    },
  });
