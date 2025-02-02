import { z } from "zod";
import { paginationSchema } from "../../../../shared/infrastructure/dtos/pagination-schema";

export const listTasksDtoSchema = paginationSchema.extend({
  userId: z.number(),
  search: z.string().optional(),
  status: z.array(z.enum(["pending", "in_progress", "completed"])).optional(),
  orderBy: z
    .object({
      field: z.enum(["dueDate"]),
      direction: z.enum(["asc", "desc"]),
    })
    .optional(),
});

export type ListTasksDto = z.infer<typeof listTasksDtoSchema>;
