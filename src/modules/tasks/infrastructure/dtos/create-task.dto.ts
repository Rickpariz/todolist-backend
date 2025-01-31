import { z } from "zod";

export const createTaskDtoSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(["pending", "in_progress", "completed"]),
  dueDate: z.coerce.date().refine((date) => date > new Date(), {
    message: "dueDate must be a future date",
  }),
  userId: z.number(),
});

export type CreateTaskUseCaseDto = z.infer<typeof createTaskDtoSchema>;
