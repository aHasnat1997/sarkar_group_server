import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { ProjectManagerValidation } from "./projectManagers.validation";
import { ProjectManagerController } from "./projectManagers.controllers";

// Create a new Express Router instance
export const ProjectManagerRoutes = Router();

/**
 * Route to get all project manager data.
 * @route GET /all
 * @access Restricted to SUPER_ADMIN and ADMIN roles.
 * @middleware authGuard - Middleware to check if the user has SUPER_ADMIN or ADMIN role.
 * @returns {void}
 */
ProjectManagerRoutes.get(
  '/all',
  authGuard('SUPER_ADMIN', 'ADMIN'),
  ProjectManagerController.getAll
);

/**
 * Route to get single project manager data.
 * @route GET /:id
 * @access Restricted to SUPER_ADMIN and ADMIN roles.
 * @middleware authGuard - Middleware to check if the user has SUPER_ADMIN or ADMIN role.
 * @returns {void}
 */
ProjectManagerRoutes.get(
  '/:id',
  authGuard('SUPER_ADMIN', 'ADMIN'),
  ProjectManagerController.getSingle
);

/**
 * Route to update project manager data.
 * @route PATCH /:userId/update
 * @access Restricted to SUPER_ADMIN and ADMIN roles.
 * @middleware validateRequest - Middleware to validate the request body using the adminUpdateSchema.
 * @middleware authGuard - Middleware to check if the user has SUPER_ADMIN or ADMIN role.
 * @returns {void}
 */
ProjectManagerRoutes.patch(
  '/:userId/update',
  validateRequest(ProjectManagerValidation.projectManagerSchema),
  authGuard('SUPER_ADMIN', 'ADMIN'),
  ProjectManagerController.updateSingle
);
