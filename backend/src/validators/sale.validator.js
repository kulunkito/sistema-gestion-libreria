import { z } from "zod";

const moneyAmount = z.coerce.number()
  .finite()
  .positive()
  .max(9999999999.99)
  .refine(value => Math.abs(value * 100 - Math.round(value * 100)) < 1e-8,
    "Debe tener como máximo dos decimales");

export const createSaleSchema = z.object({
  customerId: z.coerce.number().int().positive().nullable().optional(),
  items: z.array(z.object({
    productId: z.coerce.number().int().positive(),
    quantity: z.coerce.number().int().positive().max(4294967295)
  })).min(1),
  payments: z.array(z.object({
    method: z.enum(["CASH", "DEBIT_CARD", "CREDIT_CARD", "TRANSFER"]),
    amount: moneyAmount
  })).min(1)
});

export const cancelSaleSchema = z.object({
  reason: z.string().trim().min(1).max(255)
});
