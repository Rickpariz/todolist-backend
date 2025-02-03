import { z } from "zod";
import { userSchema } from "../../../../shared/infrastructure/dtos/user-schema";
import { isFutureDate } from "../../../../shared/application/date";

export const updateTaskDtoSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  dueDate: z.coerce
    .date()
    .refine((date) => isFutureDate(date), {
      message: "dueDate must be a future date",
    })
    .optional(),
  tokenUser: userSchema,
});

export type UpdateTaskUseCaseDto = z.infer<typeof updateTaskDtoSchema>;
