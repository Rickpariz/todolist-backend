import { z } from "zod";

export const createUserDtoSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(4),
});

export type CreateUserUseCaseDto = z.infer<typeof createUserDtoSchema>;
