
import { z } from "zod";

export const createProductSchema = z.object({
  sku: z.string().trim().min(1).max(50),
  name: z.string().trim().min(2).max(150),
  description: z.string().optional(),
  categoryId: z.coerce.number().int().positive(),
  purchasePrice: z.coerce.number().min(0),
  salePrice: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0).default(0),
  minStock: z.coerce.number().int().min(0).default(0),
  barcode: z.string().trim().max(100).optional().nullable()
});

export const updateProductSchema = createProductSchema.partial();
