import { Request, Response } from "express";
import handelAsyncReq from "../../utils/handelAsyncReq";
import successResponse from "../../utils/successResponse";
import { HTTPStatusCode } from "../../utils/httpCode";
import { ProjectGalleryService } from "./projectGalleries.services";
import { TProjectGalleryComment, TProjectGalleryCreate } from "../../types/projectGalleries.type";

/**
 * Handles the request to create project gallery information.
 * @param req - Express request object
 * @param res - Express response object
 */
const create = handelAsyncReq(async (req: Request, res: Response) => {
  // Retrieve the user id from request
  const userId = req.user?.id;

  // Extract data from request body
  const data: TProjectGalleryCreate = req.body;

  // Create project information using the ProjectGalleryService
  const result = await ProjectGalleryService.create(userId, data);

  // Send a success response with project information
  successResponse(res, {
    message: 'Project gallery add successfully.',
    data: result,
  }, HTTPStatusCode.Created);
});

/**
 * Handles the request to retrieve all project gallery information.
 * @param req - Express request object
 * @param res - Express response object
 */
const getAll = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the query from the request
  const query = req.query;

  // Retrieve the all project gallery information using the ProjectGalleryService
  const result = await ProjectGalleryService.all(query);

  // Send a success response with the retrieved profile information
  successResponse(res, {
    message: 'All project gallery found successfully.',
    mete: result.meta,
    data: result.result,
  }, HTTPStatusCode.Found);
});

/**
 * Handles the request to retrieve single project gallery information.
 * @param req - Express request object
 * @param res - Express response object
 */
const getSingle = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the project ID from the request parameters
  const id = req.params.id;

  // Retrieve single project gallery information using the ProjectGalleryService
  const result = await ProjectGalleryService.single(id);

  // Send a success response with the retrieved project information
  successResponse(res, {
    message: 'Project gallery info found successfully.',
    data: result,
  }, HTTPStatusCode.Found);
});

/**
 * Handles the request to add comment single project gallery information.
 * @param req - Express request object
 * @param res - Express response object
 */
const addComment = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the project ID from the request parameters
  const id = req.params.id;

  // Extract comment data from request user and body
  const commentData: TProjectGalleryComment = {
    userId: req.user.id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    profileImage: req.user.profileImage,
    role: req.user.role,
    comment: req.body.comment
  };

  // Retrieve single project gallery information using the ProjectGalleryService
  const result = await ProjectGalleryService.addComment(id, commentData);

  // Send a success response with the retrieved project information
  successResponse(res, {
    message: 'Project gallery info found successfully.',
    data: result,
  }, HTTPStatusCode.Found);
});

/**
 * Handles the request to delete single project gallery information.
 * @param req - Express request object
 * @param res - Express response object
 */
const deleteGallery = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the project ID from the request parameters
  const id = req.params.id;

  // Delete single project gallery information using the ProjectGalleryService
  const result = await ProjectGalleryService.deleteGallery(id);

  // Send a success response with the retrieved project information
  successResponse(res, {
    message: 'Project gallery info delete successfully.',
    data: result,
  }, HTTPStatusCode.Found);
});

// Export the Project Gallery Controller with the defined methods
export const ProjectGalleryController = {
  create,
  getAll,
  getSingle,
  addComment,
  deleteGallery
};
