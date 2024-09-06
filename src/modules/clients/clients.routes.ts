import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { ClientValidation } from "./clients.validation";
import { ClientController } from "./clients.controllers";

// Create a new Express Router instance
export const ClientRoutes = Router();

/**
 * Route to get all client data.
 * @route GET /all
 * @access Restricted to SUPER_ADMIN and ADMIN roles.
 * @middleware authGuard - Middleware to check if the user has SUPER_ADMIN or ADMIN role.
 * @returns {void}
 */
ClientRoutes.get(
  '/all',
  authGuard('SUPER_ADMIN', 'ADMIN'),
  ClientController.getAll
);

/**
 * Route to get single client data.
 * @route GET /:id
 * @access Restricted to SUPER_ADMIN and ADMIN roles.
 * @middleware authGuard - Middleware to check if the user has SUPER_ADMIN or ADMIN role.
 * @returns {void}
 */
ClientRoutes.get(
  '/:id',
  authGuard('SUPER_ADMIN', 'ADMIN'),
  ClientController.getSingle
);

/**
 * Route to update client data.
 * @route PATCH /:userId/update
 * @access Restricted to SUPER_ADMIN and ADMIN roles.
 * @middleware validateRequest - Middleware to validate the request body using the adminUpdateSchema.
 * @middleware authGuard - Middleware to check if the user has SUPER_ADMIN or ADMIN role.
 * @returns {void}
 */
ClientRoutes.patch(
  '/:userId/update',
  validateRequest(ClientValidation.clientSchema),
  authGuard('SUPER_ADMIN', 'ADMIN'),
  ClientController.updateSingle
);
