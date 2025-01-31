import { z } from "zod";

export const resetPasswordDtoSchema = z.object({
  token: z.string(),
  password: z.string().min(4),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordDtoSchema>;
