import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { ProjectValidation } from "./projects.validation";
import { ProjectController } from "./projects.controllers";

// Create a new instance of Express Router
export const ProjectRoutes = Router();

/**
 * Route to create a new project.
 * @route POST /create
 * @access Restricted to SUPER_ADMIN and ADMIN roles.
 * @middleware authGuard - Checks if the user has SUPER_ADMIN or ADMIN role.
 * @middleware validateRequest - Validates the incoming request body against the projectSchema.
 * @controller ProjectController.create - Handles the creation of a new project.
 */
ProjectRoutes.post(
  '/create',
  authGuard('SUPER_ADMIN', 'ADMIN'),
  validateRequest(ProjectValidation.projectSchema),
  ProjectController.create
);

/**
 * Route to get all projects.
 * @route GET /all
 * @access Restricted to SUPER_ADMIN, ADMIN, PROJECT_MANAGER, ENGINEER, and CLIENT roles.
 * @middleware authGuard - Checks if the user has any of the specified roles.
 * @controller ProjectController.getAll - Handles the retrieval of all projects.
 */
ProjectRoutes.get(
  '/all',
  authGuard('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'ENGINEER', 'CLIENT'),
  ProjectController.getAll
);

/**
 * Route to get a single project by ID.
 * @route GET /:id
 * @access Restricted to SUPER_ADMIN, ADMIN, PROJECT_MANAGER, ENGINEER, and CLIENT roles.
 * @middleware authGuard - Checks if the user has any of the specified roles.
 * @controller ProjectController.getSingle - Handles the retrieval of a single project by ID.
 */
ProjectRoutes.get(
  '/:id',
  authGuard('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'ENGINEER', 'CLIENT'),
  ProjectController.getSingle
);

/**
 * Route to update a single project by ID.
 * @route PATCH /:id/update
 * @access Restricted to SUPER_ADMIN, ADMIN, and PROJECT_MANAGER roles.
 * @middleware authGuard - Checks if the user has any of the specified roles.
 * @middleware validateRequest - Validates the incoming request body against the updateSchema.
 * @controller ProjectController.updateSingle - Handles the update of a project by ID.
 */
ProjectRoutes.patch(
  '/:id/update',
  authGuard('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER'),
  validateRequest(ProjectValidation.updateSchema),
  ProjectController.updateSingle
);

/**
 * Route to add an engineer to a project.
 * @route POST /:id/add-engineer
 * @access Restricted to SUPER_ADMIN and ADMIN roles.
 * @middleware authGuard - Checks if the user has SUPER_ADMIN or ADMIN role.
 * @middleware validateRequest - Validates the incoming request body against the addEngineer schema.
 * @controller ProjectController.addEngineer - Handles the addition of an engineer to a project.
 */
ProjectRoutes.post(
  '/:id/add-engineer',
  authGuard('SUPER_ADMIN', 'ADMIN'),
  validateRequest(ProjectValidation.addEngineer),
  ProjectController.addEngineer
);

/**
 * Route to remove an engineer from a project.
 * @route POST /:id/remove-engineer
 * @access Restricted to SUPER_ADMIN and ADMIN roles.
 * @middleware authGuard - Checks if the user has SUPER_ADMIN or ADMIN role.
 * @middleware validateRequest - Validates the incoming request body against the removeEngineer schema.
 * @controller ProjectController.removeEngineer - Handles the removal of an engineer from a project.
 */
ProjectRoutes.post(
  '/:id/remove-engineer',
  authGuard('SUPER_ADMIN', 'ADMIN'),
  validateRequest(ProjectValidation.removeEngineer),
  ProjectController.removeEngineer
);

/**
 * Route to add a product to a project.
 * @route POST /:id/add-product
 * @access Restricted to SUPER_ADMIN and ADMIN roles.
 * @middleware authGuard - Checks if the user has SUPER_ADMIN or ADMIN role.
 * @middleware validateRequest - Validates the incoming request body against the addProduct schema.
 * @controller ProjectController.addProduct - Handles the addition of a product to a project.
 */
ProjectRoutes.post(
  '/:id/add-product',
  authGuard('SUPER_ADMIN', 'ADMIN'),
  validateRequest(ProjectValidation.addProduct),
  ProjectController.addProduct
);

/**
 * Route to remove a product from a project.
 * @route POST /:id/remove-product
 * @access Restricted to SUPER_ADMIN and ADMIN roles.
 * @middleware authGuard - Checks if the user has SUPER_ADMIN or ADMIN role.
 * @middleware validateRequest - Validates the incoming request body against the removeProduct schema.
 * @controller ProjectController.removeProduct - Handles the removal of a product from a project.
 */
ProjectRoutes.post(
  '/:id/remove-product',
  authGuard('SUPER_ADMIN', 'ADMIN'),
  validateRequest(ProjectValidation.removeProduct),
  ProjectController.removeProduct
);
