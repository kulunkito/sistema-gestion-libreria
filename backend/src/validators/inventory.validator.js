import { z } from "zod";

export const createMovementSchema = z.object({
  productId: z.coerce.number().int().positive(),
  type: z.enum(["IN", "OUT", "ADJUSTMENT"]),
  quantity: z.coerce.number().int().min(0).max(4294967295),
  reason: z.string().trim().min(1).max(255),
  supplierId: z.coerce.number().int().positive().nullable().optional()
}).superRefine((value, context) => {
  if (value.type !== "ADJUSTMENT" && value.quantity < 1) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["quantity"],
      message: "La cantidad debe ser mayor que cero"
    });
  }
});
