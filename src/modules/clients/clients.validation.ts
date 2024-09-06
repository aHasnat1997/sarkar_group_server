import { z } from 'zod';

// Zod schema for client update
const clientSchema = z.object({
  mobile: z.string().optional(),
  productList: z.array(z.string()).optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.number().optional(),
  document: z.array(z.string()).optional(),
  user: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    profileImage: z.string().nullable().optional(),
  }).optional(),
});

export const ClientValidation = {
  clientSchema
};
