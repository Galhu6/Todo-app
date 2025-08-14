import { z } from "zod";

export const createTaskSchema = z.object({
  description: z.string().min(1).max(200),
  dueDate: z.string().optional(),
  recurrence: z.enum(["none", "daily", "weekly", "monthly"]).optional(),
});
