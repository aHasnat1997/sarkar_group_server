import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const employeeSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
  profileImage: z.string().optional(),
  mobile: z.string(),
  userName: z.string(),
  dob: z.string(),
  maritalStatus: z.string(),
  gender: z.string(),
  employeeType: z.string(),
  department: z.string(),
  designation: z.string(),
  officeLocation: z.string(),
  nationality: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.number(),
});

const clientSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
  profileImage: z.string().optional(),
  mobile: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.number(),
});

export const UserValidation = {
  loginSchema,
  employeeSchema,
  clientSchema
};
