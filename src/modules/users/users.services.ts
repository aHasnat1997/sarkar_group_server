import bcrypt from 'bcrypt';
import config from '../../config';
import prisma from '../../db';
import { Admins, Clients, Engineers, ProjectManagers, Users } from '@prisma/client';
import { TTokenPayload } from '../../types/token.type';
import { Token } from '../../utils/token';
import { TClientRegistration, TEmployeeRegistration, TLogin, TResetPassword, TSetNewPassword } from '../../types/user.type';
import { sandMail } from '../../controllers/sendMail';
import { forgetPasswordEmail } from '../../templates/forgetPasswordEmail.template';

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

  // Checking user current is active and deleted status
  if (isUserExisted.isActive === false) throw new Error('User not active!');
  if (isUserExisted.isDeleted === true) throw new Error('User Deleted!');

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
};

/**
 * Registers a new employee by creating user and role-specific records in the database.
 * @param payload - Object containing the employee's registration information.
 * @returns An object containing the newly created user's information along with role-specific data.
 */
async function employeeRegistration(payload: TEmployeeRegistration) {
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
        data: restInfo as unknown as Admins
      });
    }
    else if (user.role === 'PROJECT_MANAGER') {
      restData = await tx.projectManagers.create({
        data: restInfo as unknown as ProjectManagers
      });
    }
    else if (user.role === 'ENGINEER') {
      restData = await tx.engineers.create({
        data: restInfo as unknown as Engineers
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

/**
 * Registers a new client by creating user records in the database.
 * @param payload - Object containing the client's registration information.
 * @returns An object containing the newly created user's information.
 */
async function clientRegistration(payload: TClientRegistration) {
  // Hash the provided password with the specified number of salt rounds
  const hashedPassword = await bcrypt.hash(payload.password, Number(config.BCRYPT_SALT_ROUNDS));

  // Perform a database transaction to create user and client records
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

    // Create additional client information
    const restInfo = {
      userId: user.id,
      mobile: payload.mobile,
      street: payload.street,
      city: payload.city,
      state: payload.state,
      zip: payload.zip,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt
    }

    // Create a new client in the database
    const restData = tx.clients.create({
      data: restInfo as unknown as Clients
    });

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

/**
 * Resets the user's password.
 * @param userData - The user data object containing the user's details.
 * @param payload - The payload containing the old and new passwords.
 * @returns The updated user information.
 */
async function resetPassword(userData: Users, payload: TResetPassword) {
  // Compare the provided old password with the stored password hash
  const isOldPasswordMatch = await bcrypt.compare(payload.oldPassword, userData.password);
  // Throw an error if the old password does not match
  if (!isOldPasswordMatch) throw new Error('Old password not matched.');

  // Hash the new password with the configured salt rounds
  const newHashPassword = await bcrypt.hash(payload.newPassword, Number(config.BCRYPT_SALT_ROUNDS));

  // Update the user's password in the database and select specific fields to return
  const result = await prisma.users.update({
    where: {
      id: userData.id
    },
    data: {
      password: newHashPassword
    },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    }
  });

  // Return the result of the update operation
  return result;
}

/**
 * Handles forget password request.
 * @param email - The email address of the user requesting password reset.
 * @returns Null after sending the reset email.
 */
async function forgetPassword(email: string) {
  // Find the user in the database by email
  const isUserExisted = await prisma.users.findUniqueOrThrow({
    where: { email }
  });

  // Throw an error if the user is not active
  if (isUserExisted.isActive === false) throw new Error('User not active!');
  // Throw an error if the user is deleted
  if (isUserExisted.isDeleted === true) throw new Error('User Deleted!');

  // Create a token payload with user details
  const tokenPayload: TTokenPayload = {
    firstName: isUserExisted.firstName,
    lastName: isUserExisted.lastName,
    email: isUserExisted.email,
    profileImage: isUserExisted.profileImage!,
    role: isUserExisted.role
  }

  // Generate a token for password reset
  const forgetPasswordToken = Token.sign(tokenPayload, config.TOKEN.FORGOT_TOKEN_SECRET, config.TOKEN.FORGOT_TOKEN_EXPIRES_TIME);
  // Create a reset link with the token
  const resetLink = `${config.CLINT_URL}?status=200&success=true&forgetToken=${forgetPasswordToken}`;

  // Send a forget password email with the reset link
  await sandMail({
    to: isUserExisted.email, // Send to the user's email
    subject: 'Forget Password', // Set the email subject
    html: forgetPasswordEmail(resetLink, isUserExisted.firstName) // Set the email content
  });

  return null; // Return null after sending the email
}

/**
 * Sets a new password for the user.
 * @param payload - The payload containing the token and new password.
 * @returns The updated user information.
 */
async function setNewPassword(payload: TSetNewPassword) {
  // Verify the provided token
  const isTokenOk = Token.verify(payload.token, config.TOKEN.FORGOT_TOKEN_SECRET) as TTokenPayload;
  // Throw an error if the token is invalid
  if (!isTokenOk) throw new Error('Unauthorize to reset password.');

  // Find the user in the database by email
  const isUserExisted = await prisma.users.findFirstOrThrow({
    where: {
      email: isTokenOk.email,
    }
  });
  // Throw an error if the user is not active
  if (isUserExisted.isActive === false) throw new Error('User not active!');
  // Throw an error if the user is deleted
  if (isUserExisted.isDeleted === true) throw new Error('User Deleted!');

  // Hash the new password with the configured salt rounds
  const newHashPassword = await bcrypt.hash(payload.newPassword, Number(config.BCRYPT_SALT_ROUNDS));

  // Update the user's password in the database and select specific fields to return
  const result = await prisma.users.update({
    where: {
      email: isUserExisted.email
    },
    data: {
      password: newHashPassword
    },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      role: true
    }
  })

  // Return the result of the update operation
  return result;
}


/**
 * Retrieves the profile of a user by their email address, including role-specific data.
 * @param email - The email address of the user.
 * @returns An object containing user data along with role-specific information.
 * @throws Will throw an error if the user or role-specific data is not found.
 */
async function profile(email: string) {
  // Find the user in the database by email, selecting specific fields
  const userData = await prisma.users.findUniqueOrThrow({
    where: { email },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profileImage: true,
      role: true,
      isActive: true,
      isDeleted: true
    }
  });

  // Initialize an empty object to hold role-specific data
  let restData = {};

  // Fetch role-specific data based on the user's role
  if (userData.role === 'ADMIN' || userData.role === 'SUPER_ADMIN') {
    restData = await prisma.admins.findUniqueOrThrow({
      where: { userId: userData.id }
    });
  }
  else if (userData.role === 'PROJECT_MANAGER') {
    restData = await prisma.projectManagers.findUniqueOrThrow({
      where: { userId: userData.id }
    });
  }
  else if (userData.role === 'ENGINEER') {
    restData = await prisma.engineers.findUniqueOrThrow({
      where: { userId: userData.id }
    });
  }
  else if (userData.role === 'CLIENT') {
    restData = await prisma.clients.findUniqueOrThrow({
      where: { userId: userData.id }
    });
  }

  const finalData = {
    ...userData,
    profileData: {
      ...restData
    }
  }

  // Return the combined user data and role-specific data
  return finalData;
};

/**
 * Updates the active status of a user in the database.
 * @param id - The ID of the user.
 * @param isActive - The new active status of the user.
 * @returns - The updated user data.
 * @throws - If the isActive parameter is null.
 */
async function activeStatusUpdate(id: string, isActive: boolean) {
  // Check if the isActive parameter is null
  if (isActive === null) {
    throw new Error('Data is null!');
  };

  // Update the user's active status in the database and select specific fields
  const result = await prisma.users.update({
    where: {
      id
    },
    data: {
      isActive
    },
    select: {
      firstName: true,
      lastName: true,
      profileImage: true,
      email: true,
      isActive: true,
      role: true,
      admins: true,
      clients: true,
      engineers: true,
      projectManagers: true,
    }
  });

  // Return the updated user data
  return result;
};

/**
 * Soft deletes a user in the database by updating the isDeleted status.
 * @param id - The ID of the user.
 * @param isDeleted - The new deleted status of the user.
 * @returns} - The updated user data.
 * @throws - If the isDeleted parameter is null.
 */
async function softDeleted(id: string, isDeleted: boolean) {
  // Check if the isDeleted parameter is null
  if (isDeleted === null) {
    throw new Error('Data is null!');
  };

  // Update the user's deleted status in the database and select specific fields
  const result = await prisma.users.update({
    where: {
      id
    },
    data: {
      isDeleted
    },
    select: {
      firstName: true,
      lastName: true,
      profileImage: true,
      email: true,
      isActive: true,
      isDeleted: true,
      role: true,
      admins: true,
      clients: true,
      engineers: true,
      projectManagers: true,
    }
  });

  // Return the updated user data
  return result;
};


// Export the UserService object
export const UserService = {
  login,
  employeeRegistration,
  clientRegistration,
  resetPassword,
  forgetPassword,
  setNewPassword,
  profile,
  activeStatusUpdate,
  softDeleted
};
