import { z } from "zod";

const ProjectCategory = z.enum(['CIVIL', 'MARIN', 'ENGINEERING']);
const EquipmentStatus = z.enum([
  'WORKING',
  'STAND_BY',
  'BREAK_DOWN',
  'UNDER_MAINTENANCE',
  'OUT_OF_SERVICE',
  'IN_REPAIR',
  'DECOMMISSIONED',
  'PENDING_INSPECTION',
  'AVAILABLE',
  'RESERVED',
  'LOST',
  'DAMAGED'
]);

const productSchema = z.object({
  equipmentName: z.string(),
  equipmentImage: z.array(z.string()),
  registrationNumber: z.string(),
  category: ProjectCategory,
  status: EquipmentStatus,
  ownerName: z.string(),
  ownerAddress: z.string(),
  ownerNumber: z.string(),
  charteredBy: z.string(),
  charteredPersonPhone: z.string(),
  charteredPersonAddress: z.string(),
  brandName: z.string(),
  model: z.string(),
  dimensions: z.string(),
  manufacturingYear: z.string()
});

const updateSchema = z.object({
  equipmentName: z.string().optional(),
  equipmentImage: z.array(z.string()).optional(),
  registrationNumber: z.string().optional(),
  category: ProjectCategory.optional(),
  status: EquipmentStatus.optional(),
  ownerName: z.string().optional(),
  ownerAddress: z.string().optional(),
  ownerNumber: z.string().optional(),
  charteredBy: z.string().optional(),
  charteredPersonPhone: z.string().optional(),
  charteredPersonAddress: z.string().optional(),
  brandName: z.string().optional(),
  model: z.string().optional(),
  dimensions: z.string().optional(),
  manufacturingYear: z.string().optional(),
});

export const ProductValidation = {
  productSchema,
  updateSchema
};
