import { z } from "zod";

export const statusSchema = z.object({
  isActive: z.boolean()
});
