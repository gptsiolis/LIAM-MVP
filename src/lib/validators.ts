import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  displayName: z.string().min(1, "Display name is required").max(50),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(30)
    .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const contributeSchema = z.object({
  videoId: z.string().min(1),
  amountCents: z.number().int().min(100, "Minimum $1").max(1000000, "Maximum $10,000"),
  message: z.string().max(140).optional(),
});
