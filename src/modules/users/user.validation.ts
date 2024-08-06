import { z } from 'zod';

/**
 * Schema for validating login requests.
 */
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

/**
 * Schema for validating employee registration requests.
 */
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

/**
 * Schema for validating client registration requests.
 */
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

/**
 * Schema for validating requests to update a user's active status.
 */
const updateActiveSchema = z.object({
  isActive: z.boolean()
});

/**
 * Schema for validating requests to soft delete a user.
 */
const softDeletedSchema = z.object({
  isDeleted: z.boolean()
});

/**
 * Collection of validation schemas for user-related requests.
 */
export const UserValidation = {
  loginSchema,
  employeeSchema,
  clientSchema,
  updateActiveSchema,
  softDeletedSchema
};
