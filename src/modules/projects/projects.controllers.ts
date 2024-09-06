import { Request, Response } from "express";
import handelAsyncReq from "../../utils/handelAsyncReq";
import successResponse from "../../utils/successResponse";
import { HTTPStatusCode } from "../../utils/httpCode";
import { ProjectService } from "./projects.services";

/**
 * Handles the request to create project information.
 * @param req - Express request object
 * @param res - Express response object
 */
const create = handelAsyncReq(async (req: Request, res: Response) => {
  // Retrieve the admin id from request
  const adminId = req.user?.admins?.id;

  // Create project information using the ProjectService
  const result = await ProjectService.create(adminId, req.body);

  // Send a success response with project information
  successResponse(res, {
    message: 'Project created successfully.',
    data: result,
  }, HTTPStatusCode.Created);
});

/**
 * Handles the request to retrieve all project information.
 * @param req - Express request object
 * @param res - Express response object
 */
const getAll = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the query from the request
  const query = req.query;

  // Retrieve the all project information using the ProjectService
  const result = await ProjectService.allInfo(query);

  // Send a success response with the retrieved profile information
  successResponse(res, {
    message: 'All project found successfully.',
    mete: result.meta,
    data: result.data,
  }, HTTPStatusCode.Found);
});

/**
 * Handles the request to retrieve single project information.
 * @param req - Express request object
 * @param res - Express response object
 */
const getSingle = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the project ID from the request parameters
  const id = req.params.id;

  // Retrieve single project information using the ProjectService
  const result = await ProjectService.singleInfo(id);

  // Send a success response with the retrieved project information
  successResponse(res, {
    message: 'Project info found successfully.',
    data: result,
  }, HTTPStatusCode.Found);
});

/**
 * Handles the request to update project information.
 * @param req - Express request object
 * @param res - Express response object
 */
const updateSingle = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the project ID from the request parameters
  const id = req.params.id;

  // Extract the update data from the request body
  const updateData = req.body;

  // Update the project's information using the ProjectService
  const result = await ProjectService.updateInfo(id, updateData);

  // Send a success response with the updated project information
  successResponse(res, {
    message: 'Update project info successfully.',
    data: result,
  }, HTTPStatusCode.Ok);
});

/**
 * Handles the request to add engineer to project.
 * @param req - Express request object
 * @param res - Express response object
 */
const addEngineer = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the project ID from the request parameters
  const projectId = req.params.id;

  // Extract the engineer id's from the request body
  const engineerIds = req.body?.engineerIds as string[];

  // Adds multiple engineers to a project.
  const result = await Promise.all(
    // Map over each engineerId and call the addEngineer function asynchronously
    engineerIds.map(async (engineerId) => {
      // Call the addEngineer function from ProjectService for each engineer and project
      return await ProjectService.addEngineer(projectId, engineerId);
    })
  );

  // Send a success response with the added engineer information in project.
  successResponse(res, {
    message: 'Engineer added successfully.',
    data: result,
  }, HTTPStatusCode.Ok);
});

/**
 * Handles the request to remove engineer to project.
 * @param req - Express request object
 * @param res - Express response object
 */
const removeEngineer = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the project ID from the request parameters
  const projectId = req.params.id;

  // Extract the engineer id from the request body
  const engineerId = req.body?.engineerId;

  // Remove engineer from project
  const result = await ProjectService.removeEngineer(projectId, engineerId);

  // Send a success response with the remove engineer from project.
  successResponse(res, {
    message: 'Engineer remove successfully.',
    data: result,
  }, HTTPStatusCode.Ok);
});

/**
 * Handles the request to add product to project.
 * @param req - Express request object
 * @param res - Express response object
 */
const addProduct = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the project ID from the request parameters
  const projectId = req.params.id;

  // Extract the product id's from the request body
  const productIds = req.body?.productIds as string[];

  // Adds multiple products to a project.
  const result = await Promise.all(
    // Map over each productId and call the addProduct function asynchronously
    productIds.map(async (productId) => {
      // Call the addProduct function from ProjectService for each product and project
      return await ProjectService.addProduct(projectId, productId);
    })
  );

  // Send a success response with the added product information in project.
  successResponse(res, {
    message: 'Product added successfully.',
    data: result,
  }, HTTPStatusCode.Ok);
});

/**
 * Handles the request to remove product to project.
 * @param req - Express request object
 * @param res - Express response object
 */
const removeProduct = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the project ID from the request parameters
  const projectId = req.params.id;

  // Extract the product id from the request body
  const productId = req.body?.productId;

  // Remove product from project
  const result = await ProjectService.removeProduct(projectId, productId);

  // Send a success response with the remove product from project.
  successResponse(res, {
    message: 'Product remove successfully.',
    data: result,
  }, HTTPStatusCode.Ok);
});

// Export the Project Controller with the defined methods
export const ProjectController = {
  create,
  getAll,
  getSingle,
  updateSingle,
  addEngineer,
  removeEngineer,
  addProduct,
  removeProduct
};
