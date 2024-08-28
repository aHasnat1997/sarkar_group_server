import { z } from "zod";

const crewSchema = z.object({
  fullName: z.string(),
  phone: z.string(),
  nid: z.string(),
  productId: z.string()
});

const updateSchema = z.object({
  fullName: z.string().optional(),
  phone: z.string().optional(),
  nid: z.string().optional(),
  productId: z.string().optional()
});

export const CrewValidation = {
  crewSchema,
  updateSchema
};
