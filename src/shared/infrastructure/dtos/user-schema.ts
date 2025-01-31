import { z } from "zod";

export const userSchema = z.object({
  id: z.number().int(),
  email: z.string().email(),
  name: z.string(),
});
