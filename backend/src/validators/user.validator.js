import { z } from "zod";

const email = z.string().trim().email().max(150);
const name = z.string().trim().min(2).max(120);
const password = z.string().min(8).max(72);

export const createUserSchema = z.object({
  name,
  email,
  password,
  roleId: z.coerce.number().int().positive()
});

export const updateUserSchema = z.object({
  name: name.optional(),
  email: email.optional(),
  password: password.optional(),
  roleId: z.coerce.number().int().positive().optional()
}).refine(value => Object.keys(value).length > 0, "Debe indicar al menos un campo");
