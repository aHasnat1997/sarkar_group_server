import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { EngineerController } from "./engineers.controllers";
import { EngineerValidation } from "./engineers.validation";

// Create a new Express Router instance
export const EngineerRoutes = Router();

/**
 * Route to get all engineer data.
 * @route GET /all
 * @access Restricted to SUPER_ADMIN and ADMIN roles.
 * @middleware authGuard - Middleware to check if the user has SUPER_ADMIN or ADMIN role.
 * @returns {void}
 */
EngineerRoutes.get(
  '/all',
  authGuard('SUPER_ADMIN', 'ADMIN'),
  EngineerController.getAll
);

/**
 * Route to get single engineer data.
 * @route GET /:id
 * @access Restricted to SUPER_ADMIN and ADMIN roles.
 * @middleware authGuard - Middleware to check if the user has SUPER_ADMIN or ADMIN role.
 * @returns {void}
 */
EngineerRoutes.get(
  '/:id',
  authGuard('SUPER_ADMIN', 'ADMIN'),
  EngineerController.getSingle
);

/**
 * Route to update engineer data.
 * @route PATCH /:userId/update
 * @access Restricted to SUPER_ADMIN and ADMIN roles.
 * @middleware validateRequest - Middleware to validate the request body using the adminUpdateSchema.
 * @middleware authGuard - Middleware to check if the user has SUPER_ADMIN or ADMIN role.
 * @returns {void}
 */
EngineerRoutes.patch(
  '/:userId/update',
  validateRequest(EngineerValidation.engineerSchema),
  authGuard('SUPER_ADMIN', 'ADMIN'),
  EngineerController.updateSingle
);
