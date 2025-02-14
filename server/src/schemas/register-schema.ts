import { z } from "zod";

const registerSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  description: z.string(),
});

export default registerSchema;
