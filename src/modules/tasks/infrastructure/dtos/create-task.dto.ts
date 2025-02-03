import { z } from "zod";
import { isFutureDate } from "../../../../shared/application/date";

export const createTaskDtoSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(["pending", "in_progress", "completed"]),
  dueDate: z.coerce.date().refine((date) => isFutureDate(date), {
    message: "dueDate must be a future date",
  }),
  userId: z.number(),
});

export type CreateTaskUseCaseDto = z.infer<typeof createTaskDtoSchema>;
