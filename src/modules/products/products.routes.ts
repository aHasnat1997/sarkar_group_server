import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { ProductController } from "./products.controllers";
import { ProductValidation } from "./products.validation";

// Create a new instance of Express Router
export const ProductRoutes = Router();

/**
 * Route to create a new product.
 * @route POST /create
 * @access Restricted to ADMIN and SUPER_ADMIN roles.
 * @middleware authGuard - Middleware to check if the user has ADMIN or SUPER_ADMIN role.
 * @middleware validateRequest - Middleware to validate the request body against the productSchema.
 * @returns {void}
 */
ProductRoutes.post(
  '/create',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  validateRequest(ProductValidation.productSchema),
  ProductController.create
);

/**
 * Route to get all products.
 * @route GET /all
 * @access Public.
 * @returns {void}
 */
ProductRoutes.get(
  '/all',
  ProductController.getAll
);

/**
 * Route to get a single product by ID.
 * @route GET /:id
 * @access Public.
 * @param {string} id - The ID of the product to retrieve.
 * @returns {void}
 */
ProductRoutes.get(
  '/:id',
  ProductController.getSingle
);

/**
 * Route to update a single product by ID.
 * @route PATCH /:id/update
 * @access Restricted to ADMIN and SUPER_ADMIN roles.
 * @param {string} id - The ID of the product to update.
 * @middleware authGuard - Middleware to check if the user has ADMIN or SUPER_ADMIN role.
 * @middleware validateRequest - Middleware to validate the request body against the updateSchema.
 * @returns {void}
 */
ProductRoutes.patch(
  '/:id/update',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  validateRequest(ProductValidation.updateSchema),
  ProductController.updateSingle
);
