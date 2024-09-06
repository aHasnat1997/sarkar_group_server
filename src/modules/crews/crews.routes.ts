import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { CrewController } from "./crews.controllers";
import { CrewValidation } from "./crews.validation";

// Create a new instance of Express Router
export const CrewRoutes = Router();

/**
 * Route to create a new crew.
 * @route POST /create
 * @access Restricted to ADMIN and SUPER_ADMIN roles.
 * @middleware authGuard - Middleware to check if the user has ADMIN or SUPER_ADMIN role.
 * @middleware validateRequest - Middleware to validate the request body against the crewSchema.
 * @returns {void}
 */
CrewRoutes.post(
  '/create',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  validateRequest(CrewValidation.crewSchema),
  CrewController.create
);

/**
 * Route to get all crews.
 * @route GET /all
 * @access Restricted to ADMIN and SUPER_ADMIN roles.
 * @middleware authGuard - Middleware to check if the user has ADMIN or SUPER_ADMIN role.
 * @returns {void}
 */
CrewRoutes.get(
  '/all',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  CrewController.getAll
);

/**
 * Route to get a single crew by ID.
 * @route GET /:id
 * @access Restricted to ADMIN and SUPER_ADMIN roles.
 * @middleware authGuard - Middleware to check if the user has ADMIN or SUPER_ADMIN role.
 * @param {string} id - The ID of the crew to retrieve.
 * @returns {void}
 */
CrewRoutes.get(
  '/:id',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  CrewController.getSingle
);

/**
 * Route to update a single crew by ID.
 * @route PATCH /:id/update
 * @access Restricted to ADMIN and SUPER_ADMIN roles.
 * @param {string} id - The ID of the crew to update.
 * @middleware authGuard - Middleware to check if the user has ADMIN or SUPER_ADMIN role.
 * @middleware validateRequest - Middleware to validate the request body against the updateSchema.
 * @returns {void}
 */
CrewRoutes.patch(
  '/:id/update',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  validateRequest(CrewValidation.updateSchema),
  CrewController.updateSingle
);
