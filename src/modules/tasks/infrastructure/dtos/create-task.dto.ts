import { z } from "zod";

export const createTaskDtoSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(["pending", "in_progress", "completed"]),
  dueDate: z.coerce.date(),
  userId: z.number(),
});

export type CreateTaskUseCaseDto = z.infer<typeof createTaskDtoSchema>;
