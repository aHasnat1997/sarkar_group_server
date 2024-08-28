import { Request, Response } from "express";
import handelAsyncReq from "../../utils/handelAsyncReq";
import successResponse from "../../utils/successResponse";
import { HTTPStatusCode } from "../../utils/httpCode";
import { ProductService } from "./products.services";

/**
 * Handles the request to create product information.
 * @param req - Express request object
 * @param res - Express response object
 */
const create = handelAsyncReq(async (req: Request, res: Response) => {
  // Retrieve the admin id from request
  const adminId = req.user?.admins?.id;

  // Retrieve the user's profile information using the ProductService
  const result = await ProductService.cerate(adminId, req.body);

  // Send a success response with the retrieved profile information
  successResponse(res, {
    message: 'Product created successfully.',
    data: result,
  }, HTTPStatusCode.Created);
});

/**
 * Handles the request to retrieve all product information.
 * @param req - Express request object
 * @param res - Express response object
 */
const getAll = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the query from the request
  const query = req.query;
  // Retrieve the user's profile information using the ProductService
  const result = await ProductService.allInfo(query);

  // Send a success response with the retrieved profile information
  successResponse(res, {
    message: 'All product found successfully.',
    mete: result.meta,
    data: result.result,
  }, HTTPStatusCode.Found);
});

/**
 * Handles the request to retrieve single product information.
 * @param req - Express request object
 * @param res - Express response object
 */
const getSingle = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the product ID from the request parameters
  const id = req.params.id;

  // Retrieve the user's profile information using the UserService
  const result = await ProductService.singleInfo(id);

  // Send a success response with the retrieved profile information
  successResponse(res, {
    message: 'Product info found successfully.',
    data: result,
  }, HTTPStatusCode.Found);
});

/**
 * Handles the request to update product information.
 * @param req - Express request object
 * @param res - Express response object
 */
const updateSingle = handelAsyncReq(async (req: Request, res: Response) => {
  // Extract the product ID from the request parameters
  const id = req.params.id;

  // Extract the update data from the request body
  const updateData = req.body;

  // Retrieve the product's information using the ProductService
  const result = await ProductService.updateInfo(id, updateData);

  // Send a success response with the retrieved product information
  successResponse(res, {
    message: 'Update product info successfully.',
    data: result,
  }, HTTPStatusCode.Found);
});

// Export the Product Controller with the defined methods
export const ProductController = {
  create,
  getAll,
  getSingle,
  updateSingle
};
