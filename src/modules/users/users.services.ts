import bcrypt from 'bcrypt';
import config from '../../config';
import prisma from '../../db';
import { Admins, Engineers, ProjectManagers, Users } from '@prisma/client';
import { TTokenPayload } from '../../types/token.type';
import { Token } from '../../utils/token';

type TLogin = {
  email: string,
  password: string
}

/**
 * Logs in a user by verifying their email and password.
 * @param payload - Object containing the email and password of the user.
 * @returns An object containing the access token and refresh token.
 * @throws Will throw an error if the password is incorrect.
 */
async function login(payload: TLogin) {
  // Find the user in the database by email
  const isUserExisted = await prisma.users.findUniqueOrThrow({
    where: {
      email: payload.email
    }
  });

  // Compare the provided password with the stored hashed password
  const isPasswordMatch = await bcrypt.compare(payload.password, isUserExisted.password);
  if (!isPasswordMatch) throw new Error('Password incorrect.');

  // Create a token payload with user details
  const tokenPayload: TTokenPayload = {
    firstName: isUserExisted.firstName,
    lastName: isUserExisted.lastName,
    email: isUserExisted.email,
    profileImage: isUserExisted.profileImage!,
    role: isUserExisted.role
  }

  // Generate access and refresh tokens using the token payload and secret keys
  const accessToken = Token.sign(tokenPayload, config.TOKEN.ACCESS_TOKEN_SECRET, config.TOKEN.ACCESS_TOKEN_EXPIRES_TIME);
  const refreshToken = Token.sign(tokenPayload, config.TOKEN.REFRESH_TOKEN_SECRET, config.TOKEN.REFRESH_TOKEN_EXPIRES_TIME);

  // Return the generated tokens
  return { accessToken, refreshToken };
}

/**
 * Registers a new employee by creating user and role-specific records in the database.
 * @param payload - Object containing the employee's registration information.
 * @returns An object containing the newly created user's information along with role-specific data.
 */
async function employeeRegistration(payload: any) {
  // Hash the provided password with the specified number of salt rounds
  const hashedPassword = await bcrypt.hash(payload.password, Number(config.BCRYPT_SALT_ROUNDS));

  // Perform a database transaction to create user and role-specific records
  const result = await prisma.$transaction(async (tx) => {
    // Create a user information object
    const userInfo = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: hashedPassword,
      profileImage: payload.profileImage,
      role: payload.role,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt
    };

    // Create a new user in the database
    const user = await tx.users.create({
      data: userInfo as Users
    });

    // Create additional employee-specific information
    const restInfo = {
      userId: user.id,
      employeeId: payload.employeeId,
      mobile: payload.mobile,
      userName: payload.userName,
      dob: payload.dob,
      maritalStatus: payload.maritalStatus,
      gender: payload.gender,
      employeeType: payload.employeeType,
      department: payload.department,
      designation: payload.designation,
      joiningDate: payload.joiningDate,
      officeLocation: payload.officeLocation,
      nationality: payload.nationality,
      street: payload.street,
      city: payload.city,
      state: payload.state,
      zip: payload.zip,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt
    }

    // Variable to store role-specific data
    let restData = {};

    // Create role-specific record based on the user's role
    if (user.role === 'ADMIN') {
      restData = await tx.admins.create({
        data: restInfo as Admins
      });
    }
    else if (user.role === 'PROJECT_MANAGER') {
      restData = await tx.projectManagers.create({
        data: restInfo as ProjectManagers
      });
    }
    else if (user.role === 'ENGINEER') {
      restData = await tx.engineers.create({
        data: restInfo as Engineers
      });
    }

    // Return the newly created user information along with role-specific data
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      ...restData
    }
  });

  // Return the result of the transaction
  return result;
};

// Export the UserService object containing the login and employeeRegistration functions
export const UserService = {
  login,
  employeeRegistration
};
