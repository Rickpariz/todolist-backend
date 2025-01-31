import { z } from "zod";

export const deleteDtoSchema = z.object({
  id: z.number(),
  userId: z.number(),
});

export type DeleteTaskDto = z.infer<typeof deleteDtoSchema>;
