import { z } from "zod";

const Department = z.enum(['CIVIL', 'MARIN', 'ENGINEERING']);
const ProjectType = z.enum(['CIVIL', 'MARIN', 'ENGINEERING']);
const ProductType = z.enum(['CIVIL', 'MARIN', 'ENGINEERING']);
const ProjectStatus = z.enum([
  'NOT_STARTED',
  'IN_PROGRESS',
  'ON_HOLD',
  'COMPLETED',
  'CANCELLED',
  'DELAYED',
  'UNDER_REVIEW',
  'APPROVED',
  'ARCHIVED'
]);

const projectSchema = z.object({
  projectName: z.string(),
  department: Department,
  clientId: z.string(),
  projectManagerId: z.string(),
  startDate: z.string().datetime(),
  estimatedEndDate: z.string().datetime(),
  projectType: ProjectType,
  productType: ProductType,
  status: ProjectStatus,
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.number()
});

const updateSchema = z.object({
  projectName: z.string().optional(),
  department: Department.optional(),
  clientId: z.string().optional(),
  projectManagerId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  estimatedEndDate: z.string().datetime().optional(),
  projectType: ProjectType.optional(),
  productType: ProductType.optional(),
  status: ProjectStatus.optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.number().optional(),
});

const addEngineer = z.object({
  engineerIds: z.array(z.string())
});

const removeEngineer = z.object({
  engineerId: z.string()
})

const addProduct = z.object({
  productIds: z.array(z.string())
});

const removeProduct = z.object({
  productId: z.string()
});

export const ProjectValidation = {
  projectSchema,
  updateSchema,
  addEngineer,
  removeEngineer,
  addProduct,
  removeProduct
};
