
import { z } from "zod";

const price = z.coerce.number()
  .finite()
  .min(0)
  .max(9999999999.99)
  .refine(value => Math.abs(value * 100 - Math.round(value * 100)) < 1e-8,
    "Debe tener como máximo dos decimales");

export const createProductSchema = z.object({
  sku: z.string().trim().min(1).max(50),
  name: z.string().trim().min(2).max(150),
  description: z.string().optional(),
  categoryId: z.coerce.number().int().positive(),
  purchasePrice: price,
  salePrice: price.refine(value => value > 0, "Debe ser mayor que cero"),
  stock: z.coerce.number().int().min(0).max(4294967295).default(0),
  minStock: z.coerce.number().int().min(0).max(4294967295).default(0),
  barcode: z.string().trim().max(100).optional().nullable()
});

export const updateProductSchema = createProductSchema.partial();
export const safeUpdateProductSchema = createProductSchema.omit({ stock: true }).partial()
  .refine(value => Object.keys(value).length > 0, "Debe indicar al menos un campo");
