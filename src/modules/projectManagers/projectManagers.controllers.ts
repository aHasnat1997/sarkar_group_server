import { Request, Response } from "express";
import handelAsyncReq from "../../utils/handelAsyncReq";
import successResponse from "../../utils/successResponse";
import { HTTPStatusCode } from "../../utils/httpCode";
import { ProjectManagerService } from "./projectManagers.services";

/**
 * Handles the request to retrieve all project manager information.
 * @param req - Express request object
 * @param res - Express response object
 */
const getAll = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the query from the request
  const query = req.query;
  // Retrieve the user's profile information using the UserService
  const result = await ProjectManagerService.allData(query);

  // Send a success response with the retrieved profile information
  successResponse(res, {
    message: 'All project manager found successfully.',
    mete: result.meta,
    data: result.result,
  }, HTTPStatusCode.Found);
});

/**
 * Handles the request to retrieve single project manager information.
 * @param req - Express request object
 * @param res - Express response object
 */
const getSingle = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the project manager ID from the request parameters
  const id = req.params.id;

  // Retrieve the user's profile information using the UserService
  const result = await ProjectManagerService.singleData(id as string);

  // Send a success response with the retrieved profile information
  successResponse(res, {
    message: 'Project-Manager info found successfully.',
    data: result,
  }, HTTPStatusCode.Found);
});

/**
 * Handles the request to update project manager information.
 * @param req - Express request object
 * @param res - Express response object
 */
const updateSingle = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the user ID from the request parameters
  const id = req.params.userId;

  // Extract the update data from the request body
  const updateData = req.body;

  // Retrieve the user's profile information using the UserService
  const result = await ProjectManagerService.updateData(id, updateData);

  // Send a success response with the retrieved profile information
  successResponse(res, {
    message: 'Update project manager info successfully.',
    data: result,
  }, HTTPStatusCode.Found);
});

// Export the project managerController with the defined methods
export const ProjectManagerController = {
  getAll,
  getSingle,
  updateSingle
};
