import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import { AdminController } from "./admins.controllers";
import validateRequest from "../../middlewares/validateRequest";
import { AdminValidation } from "./admins.validation";

// Create a new Express Router instance
export const AdminRoutes = Router();

/**
 * Route to get all admin data.
 * @route GET /all
 * @access Restricted to SUPER_ADMIN and ADMIN roles.
 * @middleware authGuard - Middleware to check if the user has SUPER_ADMIN or ADMIN role.
 * @returns {void}
 */
AdminRoutes.get(
  '/all',
  authGuard('SUPER_ADMIN', 'ADMIN'),
  AdminController.getAllAdmin
);

/**
 * Route to get single admin data.
 * @route GET /:id
 * @access Restricted to SUPER_ADMIN and ADMIN roles.
 * @middleware authGuard - Middleware to check if the user has SUPER_ADMIN or ADMIN role.
 * @returns {void}
 */
AdminRoutes.get(
  '/:id',
  authGuard('SUPER_ADMIN', 'ADMIN'),
  AdminController.getSingleAdmin
);

/**
 * Route to update admin data.
 * @route PATCH /:userId/update
 * @access Restricted to SUPER_ADMIN and ADMIN roles.
 * @middleware validateRequest - Middleware to validate the request body using the adminUpdateSchema.
 * @middleware authGuard - Middleware to check if the user has SUPER_ADMIN or ADMIN role.
 * @returns {void}
 */
AdminRoutes.patch(
  '/:userId/update',
  validateRequest(AdminValidation.adminUpdateSchema),
  authGuard('SUPER_ADMIN', 'ADMIN'),
  AdminController.updateAdmin
);
