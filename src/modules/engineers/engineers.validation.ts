import { z } from 'zod';

// Assuming MaritalStatus, GenderStatus, EmployeeType, Department, Designation are enums or specific string unions, you can define them like this:
const MaritalStatus = z.enum(['MARRIED', 'SINGLE']);
const GenderStatus = z.enum(['MALE', 'FEMALE', 'OTHER']);
const EmployeeType = z.enum(['NotDef']);
const Department = z.enum(['NotDef']);
const Designation = z.enum(['NotDef']);

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
