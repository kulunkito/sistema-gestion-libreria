import { z } from "zod";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}, "Fecha inválida");

export const reportQuerySchema = z.object({
  from: date.optional(),
  to: date.optional(),
  limit: z.coerce.number().int().positive().max(50).optional()
}).refine(value => !value.from || !value.to || value.from <= value.to, {
  message: "La fecha inicial debe ser anterior o igual a la fecha final"
});
