import { z } from "zod";
import { paginationSchema } from "../../../../shared/infrastructure/dtos/pagination-schema";

export const listTasksDtoSchema = paginationSchema.extend({
  userId: z.number(),
  orderBy: z
    .object({
      field: z.enum(["dueDate"]),
      direction: z.enum(["asc", "desc"]),
    })
    .optional(),
});

export type ListTasksDto = z.infer<typeof listTasksDtoSchema>;
