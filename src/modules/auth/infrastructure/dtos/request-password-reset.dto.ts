import { z } from "zod";

export const requestPasswordResetDtoSchema = z.object({
  email: z.string().email(),
});

export type RequestPasswordResetDto = z.infer<
  typeof requestPasswordResetDtoSchema
>;
