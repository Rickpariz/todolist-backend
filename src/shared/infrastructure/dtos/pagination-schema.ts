import { z } from "zod";

export const paginationSchema = z.object({
  pageSize: z.string().optional().default("10"),
  pageNumber: z.string().optional().default("1"),
});
