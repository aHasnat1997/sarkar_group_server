import { Request, Response } from "express";
import handelAsyncReq from "../../utils/handelAsyncReq";
import successResponse from "../../utils/successResponse";
import { HTTPStatusCode } from "../../utils/httpCode";
import { AdminService } from "./admins.services";

/**
 * Handles the request to retrieve all admin information.
 * @param req - Express request object
 * @param res - Express response object
 */
const getAllAdmin = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the query from the request
  const query = req.query;
  // Retrieve the user's profile information using the UserService
  const result = await AdminService.allAdminData(query);

  // Send a success response with the retrieved profile information
  successResponse(res, {
    message: 'All admin found successfully.',
    mete: result.meta,
    data: result.result,
  }, HTTPStatusCode.Found);
});

/**
 * Handles the request to retrieve single admin information.
 * @param req - Express request object
 * @param res - Express response object
 */
const getSingleAdmin = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the admin ID from the request parameters
  const id = req.params.id;

  // Retrieve the user's profile information using the UserService
  const result = await AdminService.singleAdminData(id as string);

  // Send a success response with the retrieved profile information
  successResponse(res, {
    message: 'Admin info found successfully.',
    data: result,
  }, HTTPStatusCode.Found);
});

/**
 * Handles the request to update admin information.
 * @param req - Express request object
 * @param res - Express response object
 */
const updateAdmin = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the user ID from the request parameters
  const id = req.params.userId;

  // Extract the update data from the request body
  const updateData = req.body;

  // Retrieve the user's profile information using the UserService
  const result = await AdminService.updateData(id, updateData);

  // Send a success response with the retrieved profile information
  successResponse(res, {
    message: 'Update admin info successfully.',
    data: result,
  }, HTTPStatusCode.Found);
});

// Export the AdminController with the defined methods
export const AdminController = {
  getAllAdmin,
  getSingleAdmin,
  updateAdmin
};
