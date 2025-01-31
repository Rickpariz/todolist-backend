import { z } from "zod";
import { userSchema } from "../../../../shared/infrastructure/dtos/user-schema";

export const updateUserDtoSchema = z.object({
  id: z.number().int(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  tokenUser: userSchema,
});

export type UpdateUserUseCaseDto = z.infer<typeof updateUserDtoSchema>;
