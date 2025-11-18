"use client";

import { cn } from "@/lib/utils";
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
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8, {
    error: "Must be at least 8 characters long.",
  }),
});
type FormSchema = z.infer<typeof formSchema>;

const toastId = "LOGIN-TOAST";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
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
  const githubMutation = useMutation({
    mutationFn: async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    },
    onMutate: () => {
      toast.loading("Logging in with GitHub", {
        id: toastId,
      });
    },
    onSuccess: () => {
      toast.success("Welcome!", {
        id: toastId,
      });
    },
    onError: (error) => {
      console.error("Error logging in via github:", error);
      toast.error("Sorry, an error occured", {
        id: toastId,
      });
    },
  });
  const isPending = githubMutation.isPending || emailMutation.isPending;
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit((values) =>
              emailMutation.mutate(values),
            )}
          >
            <fieldset disabled={isPending}>
              <FieldGroup>
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
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Field>
                  <Button type="submit">Login</Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => githubMutation.mutate()}
                  >
                    Login with GitHub
                  </Button>
                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup">Sign up</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </fieldset>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
