import { z } from "zod";
export const SignupSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Your Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  description: z.string().max(200, {
    message: "Description must be at most 200 characters.",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
});
