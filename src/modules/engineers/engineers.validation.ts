import { z } from 'zod';

// Assuming MaritalStatus, GenderStatus, EmployeeType, Department, Designation are enums or specific string unions, you can define them like this:
const MaritalStatus = z.enum(['MARRIED', 'SINGLE']);
const GenderStatus = z.enum(['MALE', 'FEMALE', 'OTHER']);
const EmployeeType = z.enum([
  'FULL_TIME',
  'PART_TIME',
  'INTERN',
  'TEMPORARY',
  'CONTRACTOR',
  'FREELANCER',
  'CONSULTANT',
  'REMOTE',
  'ON_SITE',
  'SHIFT_WORKER',
  'SEASONAL',
  'CASUAL',
  'VOLUNTEER',
  'APPRENTICE',
  'TRAINEE'
]);
const Department = z.enum(['CIVIL', 'MARIN', 'ENGINEERING']);
const Designation = z.enum([
  'CEO',
  'COO',
  'CFO',
  'CTO',
  'CMO',
  'CHRO',
  'CIO',
  'CPO',
  'CLO',
  'VICE_PRESIDENT_OPERATIONS',
  'VICE_PRESIDENT_SALES',
  'VICE_PRESIDENT_ENGINEERING',
  'VICE_PRESIDENT_MARKETING',
  'VICE_PRESIDENT_PRODUCT_MANAGEMENT',
  'VICE_PRESIDENT_HUMAN_RESOURCES',
  'VICE_PRESIDENT_FINANCE',
  'VICE_PRESIDENT_SUPPLY_CHAIN',
  'DIRECTOR_OPERATIONS',
  'DIRECTOR_ENGINEERING',
  'DIRECTOR_SALES',
  'DIRECTOR_MARKETING',
  'DIRECTOR_PRODUCT_DEVELOPMENT',
  'DIRECTOR_FINANCE',
  'DIRECTOR_HUMAN_RESOURCES',
  'DIRECTOR_CUSTOMER_SERVICE',
  'ENGINEERING_MANAGER',
  'PRODUCT_MANAGER',
  'SALES_MANAGER',
  'MARKETING_MANAGER',
  'OPERATIONS_MANAGER',
  'FINANCE_MANAGER',
  'HUMAN_RESOURCES_MANAGER',
  'IT_MANAGER',
  'QUALITY_ASSURANCE_MANAGER',
  'SUPPLY_CHAIN_MANAGER',
  'LEAD_SOFTWARE_ENGINEER',
  'SENIOR_DATA_SCIENTIST',
  'PRINCIPAL_ARCHITECT',
  'UX_UI_DESIGN_LEAD',
  'DEVOPS_ENGINEER',
  'SENIOR_PROJECT_MANAGER',
  'LEGAL_COUNSEL',
  'COMPLIANCE_OFFICER',
  'DATA_PROTECTION_OFFICER',
  'TALENT_ACQUISITION_MANAGER',
  'CORPORATE_COMMUNICATIONS_MANAGER',
  'SOFTWARE_ENGINEER',
  'DATA_ANALYST',
  'SALES_EXECUTIVE',
  'MARKETING_SPECIALIST',
  'HR_SPECIALIST',
  'ACCOUNTANT',
  'CUSTOMER_SUPPORT_REPRESENTATIVE',
  'SUPPLY_CHAIN_COORDINATOR',
  'ADMINISTRATIVE_ASSISTANT',
  'TECHNICAL_WRITER',
  'JUNIOR_SOFTWARE_DEVELOPER',
  'MARKETING_ASSOCIATE',
  'SALES_ASSOCIATE',
  'HR_ASSISTANT',
  'FINANCIAL_ANALYST',
  'CUSTOMER_SUPPORT_AGENT',
  'OPERATIONS_ANALYST',
  'IT_SUPPORT_TECHNICIAN',
  'PROJECT_COORDINATOR'
]);

// Zod schema for engineer update
const engineerSchema = z.object({
  mobile: z.string().optional(),
  userName: z.string().optional(),
  dob: z.string().datetime().optional(),
  maritalStatus: MaritalStatus.optional(),
  gender: GenderStatus.optional(),
  employeeType: EmployeeType.optional(),
  department: Department.optional(),
  designation: Designation.optional(),
  officeLocation: z.string().optional(),
  nationality: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.number().optional(),
  appointmentLetter: z.string().optional(),
  salarySlips: z.array(z.string()).optional(),
  relivingLetter: z.string().optional(),
  experienceLetter: z.string().optional(),
  assignProjects: z.array(z.string()).optional(),
  user: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    profileImage: z.string().nullable().optional(),
  }).optional(),
});

export const EngineerValidation = {
  engineerSchema
};
