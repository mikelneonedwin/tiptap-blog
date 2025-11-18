import z from "zod";

export const loginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8, {
    error: "Must be at least 8 characters long.",
  }),
});
export type LoginFormSchema = z.infer<typeof loginFormSchema>;

export const signupFormSchema = loginFormSchema
  .extend({
    confirmPassword: z.string().min(8),
    name: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
export type SignupFormSchema = z.infer<typeof signupFormSchema>;
