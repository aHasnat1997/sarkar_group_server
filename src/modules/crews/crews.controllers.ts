import { Request, Response } from "express";
import handelAsyncReq from "../../utils/handelAsyncReq";
import successResponse from "../../utils/successResponse";
import { HTTPStatusCode } from "../../utils/httpCode";
import { CrewService } from "./crews.services";

/**
 * Handles the request to create crew information.
 * @param req - Express request object
 * @param res - Express response object
 */
const create = handelAsyncReq(async (req: Request, res: Response) => {
  // Retrieve the user's profile information using the CrewService
  const result = await CrewService.cerate(req.body);

  // Send a success response with the retrieved profile information
  successResponse(res, {
    message: 'Crew created successfully.',
    data: result,
  }, HTTPStatusCode.Created);
});

/**
 * Handles the request to retrieve all crew information.
 * @param req - Express request object
 * @param res - Express response object
 */
const getAll = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the query from the request
  const query = req.query;
  // Retrieve the user's profile information using the CrewService
  const result = await CrewService.allInfo(query);

  // Send a success response with the retrieved profile information
  successResponse(res, {
    message: 'All crew found successfully.',
    mete: result.meta,
    data: result.result,
  }, HTTPStatusCode.Found);
});

/**
 * Handles the request to retrieve single crew information.
 * @param req - Express request object
 * @param res - Express response object
 */
const getSingle = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the crew ID from the request parameters
  const id = req.params.id;

  // Retrieve the user's profile information using the UserService
  const result = await CrewService.singleInfo(id);

  // Send a success response with the retrieved profile information
  successResponse(res, {
    message: 'Crew info found successfully.',
    data: result,
  }, HTTPStatusCode.Found);
});

/**
 * Handles the request to update crew information.
 * @param req - Express request object
 * @param res - Express response object
 */
const updateSingle = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the crew ID from the request parameters
  const id = req.params.id;

  // Extract the update data from the request body
  const updateData = req.body;

  // Retrieve the crew's information using the CrewService
  const result = await CrewService.updateInfo(id, updateData);

  // Send a success response with the retrieved crew information
  successResponse(res, {
    message: 'Update crew info successfully.',
    data: result,
  }, HTTPStatusCode.Found);
});

// Export the Crew Controller with the defined methods
export const CrewController = {
  create,
  getAll,
  getSingle,
  updateSingle
};
