import { Request, Response } from "express";
import handelAsyncReq from "../../utils/handelAsyncReq";
import successResponse from "../../utils/successResponse";
import { HTTPStatusCode } from "../../utils/httpCode";
import { UserRole } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { UserService } from "./users.services";

/**
 * Handles user login by verifying credentials and setting a refresh token cookie.
 * @param req - Express request object
 * @param res - Express response object
 */
const userLogin = handelAsyncReq(async (req: Request, res: Response) => {
  // Call the login function from UserService with request body
  const result = await UserService.login(req.body);
  // Set the refresh token as an HTTP-only cookie
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true
  });
  // Send a success response with the access token
  successResponse(res, {
    message: 'User logged in successfully.',
    data: result.accessToken
  }, HTTPStatusCode.Ok);
});

/**
 * Handles user logout by clearing the refresh token cookie.
 * @param req - Express request object
 * @param res - Express response object
 */
const userLogout = handelAsyncReq(async (req: Request, res: Response) => {
  // Clear the refresh token cookie
  res.clearCookie('refreshToken');
  // Send a success response indicating the user has logged out
  successResponse(res, {
    message: 'User logged out successfully.',
    data: null
  }, HTTPStatusCode.Ok);
});

/**
 * Handles registration of a new admin user.
 * @param req - Express request object
 * @param res - Express response object
 */
const adminRegistration = handelAsyncReq(async (req: Request, res: Response) => {
  const timeStamp = new Date();
  // Create an admin information object with additional properties
  const adminInfo = {
    ...req.body,
    role: UserRole.ADMIN,
    employeeId: `SG_SMD-ADMIN-${uuid()}`,
    joiningDate: timeStamp,
    createdAt: timeStamp,
    updatedAt: timeStamp
  };

  // Call the employeeRegistration function from UserService with admin information
  const result = await UserService.employeeRegistration(adminInfo);
  // Send a success response with the newly registered admin data
  successResponse(res, {
    message: 'Admin Registration Successful.',
    data: result
  }, HTTPStatusCode.Created);
});

/**
 * Handles registration of a new project manager.
 * @param req - Express request object
 * @param res - Express response object
 */
const projectManagersRegistration = handelAsyncReq(async (req: Request, res: Response) => {
  const timeStamp = new Date();
  // Create a project manager information object with additional properties
  const projectManagersInfo = {
    ...req.body,
    role: UserRole.PROJECT_MANAGER,
    employeeId: `SG_SMD-PM-${uuid()}`,
    joiningDate: timeStamp,
    createdAt: timeStamp,
    updatedAt: timeStamp
  };

  // Call the employeeRegistration function from UserService with project manager information
  const result = await UserService.employeeRegistration(projectManagersInfo);
  // Send a success response with the newly registered project manager data
  successResponse(res, {
    message: 'Project Manager Registration Successful.',
    data: result
  }, HTTPStatusCode.Created);
});

/**
 * Handles registration of a new engineer.
 * @param req - Express request object
 * @param res - Express response object
 */
const engineersRegistration = handelAsyncReq(async (req: Request, res: Response) => {
  const timeStamp = new Date();
  // Create an engineer information object with additional properties
  const engineersInfo = {
    ...req.body,
    role: UserRole.ENGINEER,
    employeeId: `SG_SMD-ENG-${uuid()}`,
    joiningDate: timeStamp,
    createdAt: timeStamp,
    updatedAt: timeStamp
  };

  // Call the employeeRegistration function from UserService with engineer information
  const result = await UserService.employeeRegistration(engineersInfo);
  // Send a success response with the newly registered engineer data
  successResponse(res, {
    message: 'Engineer Registration Successful.',
    data: result
  }, HTTPStatusCode.Created);
});

// Export the UserController object containing the handler functions
export const UserController = {
  userLogin,
  userLogout,
  adminRegistration,
  projectManagersRegistration,
  engineersRegistration,
};
