import { z } from "zod";

export const authCredentialsSchema = z.object({
  email: z.email().trim(),
  password: z.string().min(8),
});

export const signupSchema = authCredentialsSchema
  .extend({
    confirmPassword: z.string().min(8),
    organizationName: z.string().trim().min(2),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
