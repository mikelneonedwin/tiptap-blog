"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8, {
      error: "Must be at least 8 characters long.",
    }),
    confirmPassword: z.string().min(8),
    name: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
type FormSchema = z.infer<typeof formSchema>;

const toastId = "SIGNUP-TOAST";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });
  const emailMutation = useMutation({
    mutationFn: async (data: FormSchema) => {
      await authClient.signIn.email({
        ...data,
        callbackURL: "/dashboard",
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
  const githubMutation = useMutation({
    mutationFn: async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    },
    onMutate: () => {
      toast.loading("Creating account with GitHub", {
        id: toastId,
      });
    },
    onSuccess: () => {
      toast.success("Welcome aboard!", {
        id: toastId,
      });
    },
    onError: (error) => {
      console.error("Error creating account in via github:", error);
      toast.error("Sorry, an error occured", {
        id: toastId,
      });
    },
  });
  const isPending = githubMutation.isPending || emailMutation.isPending;
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit((values) => emailMutation.mutate(values))}
        >
          <fieldset disabled={isPending}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="John Doe"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="capitalize">
                      {field.name}
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="m@example.com"
                    />
                    <FieldDescription>
                      We&apos;ll use this to contact you. We will not share your
                      email with anyone else.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="capitalize">
                      {field.name}
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type={field.name}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>
                      Must be at least 8 characters long.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="password"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>
                      Please confirm your password.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <FieldGroup>
                <Field>
                  <Button type="submit">Create Account</Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => githubMutation.mutate()}
                  >
                    Sign up with GitHub
                  </Button>
                  <FieldDescription className="px-6 text-center">
                    Already have an account? <Link href="/login">Sign in</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
}
