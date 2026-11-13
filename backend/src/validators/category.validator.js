import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(255).nullable().optional()
});

export const updateCategorySchema = createCategorySchema.partial()
  .refine(value => Object.keys(value).length > 0, "Debe indicar al menos un campo");
