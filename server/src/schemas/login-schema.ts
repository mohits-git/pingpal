import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6),
});

export default loginSchema;
