import { z } from "zod";

export const getTaskDtoSchema = z.object({
  id: z.number(),
  userId: z.number(),
});

export type GetTaskDto = z.infer<typeof getTaskDtoSchema>;
