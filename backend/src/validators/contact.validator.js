import { z } from "zod";

const optionalText = max => z.string().trim().max(max).nullable().optional();

export const createCustomerSchema = z.object({
  name: z.string().trim().min(2).max(150),
  documentNumber: optionalText(30),
  email: z.union([z.string().trim().email().max(150), z.literal(""), z.null()]).optional(),
  phone: optionalText(30),
  address: optionalText(255)
});

export const updateCustomerSchema = createCustomerSchema.partial()
  .refine(value => Object.keys(value).length > 0, "Debe indicar al menos un campo");

export const createSupplierSchema = z.object({
  name: z.string().trim().min(2).max(150),
  taxId: optionalText(20),
  email: z.union([z.string().trim().email().max(150), z.literal(""), z.null()]).optional(),
  phone: optionalText(30),
  address: optionalText(255)
});

export const updateSupplierSchema = createSupplierSchema.partial()
  .refine(value => Object.keys(value).length > 0, "Debe indicar al menos un campo");
