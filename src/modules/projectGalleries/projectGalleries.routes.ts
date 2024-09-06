import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { ProjectGalleryValidation } from "./projectGalleries.validation";
import { ProjectGalleryController } from "./projectGalleries.controllers";

// Create a new instance of Express Router
export const ProjectGalleryRoutes = Router();

/**
 * Route to create a new project gallery.
 * @route POST /create
 * @access Restricted to SUPER_ADMIN, ADMIN, and PROJECT_MANAGER roles.
 * @middleware authGuard - Middleware to check if the user has SUPER_ADMIN, ADMIN, or PROJECT_MANAGER role.
 * @middleware validateRequest - Middleware to validate the request body against the createSchema.
 * @returns {void}
 */
ProjectGalleryRoutes.post(
  '/create',
  authGuard('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER'),
  validateRequest(ProjectGalleryValidation.createSchema),
  ProjectGalleryController.create
);

/**
 * Route to get all project galleries.
 * @route GET /all
 * @access Restricted to SUPER_ADMIN, ADMIN, PROJECT_MANAGER, ENGINEER, and CLIENT roles.
 * @middleware authGuard - Middleware to check if the user has the appropriate role.
 * @returns {void}
 */
ProjectGalleryRoutes.get(
  '/all',
  authGuard('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'ENGINEER', 'CLIENT'),
  ProjectGalleryController.getAll
);

/**
 * Route to get a single project gallery by ID.
 * @route GET /:id
 * @access Restricted to SUPER_ADMIN, ADMIN, PROJECT_MANAGER, ENGINEER, and CLIENT roles.
 * @middleware authGuard - Middleware to check if the user has the appropriate role.
 * @returns {void}
 */
ProjectGalleryRoutes.get(
  '/:id',
  authGuard('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'ENGINEER', 'CLIENT'),
  ProjectGalleryController.getSingle
);

/**
 * Route to add a comment to a project gallery.
 * @route PATCH /:id/add-comment
 * @access Restricted to SUPER_ADMIN, ADMIN, PROJECT_MANAGER, ENGINEER, and CLIENT roles.
 * @middleware authGuard - Middleware to check if the user has the appropriate role.
 * @middleware validateRequest - Middleware to validate the request body against the commentSchema.
 * @returns {void}
 */
ProjectGalleryRoutes.patch(
  '/:id/add-comment',
  authGuard('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'ENGINEER', 'CLIENT'),
  validateRequest(ProjectGalleryValidation.commentSchema),
  ProjectGalleryController.addComment
);

/**
 * Route to delete a project gallery by ID.
 * @route DELETE /:id
 * @access Restricted to SUPER_ADMIN and ADMIN roles.
 * @middleware authGuard - Middleware to check if the user has SUPER_ADMIN or ADMIN role.
 * @returns {void}
 */
ProjectGalleryRoutes.delete(
  '/:id',
  authGuard('SUPER_ADMIN', 'ADMIN'),
  ProjectGalleryController.deleteGallery
);
