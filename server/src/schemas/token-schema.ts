import { z } from "zod";

const tokenSchema = z.object({
  username: z.string()
});

export default tokenSchema;
