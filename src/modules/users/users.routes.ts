import { Router } from "express";
import { UserController } from "./users.controllers";
import { authGuard } from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";

// Create a new Express Router instance
export const UserRoutes = Router();

/**
 * Route to handle user login.
 * @route POST /login
 * @access Public
 * @middleware validateRequest - Middleware to validate the request body against the loginSchema
 * @controller UserController.userLogin - Controller function to handle the login
 */
UserRoutes.post(
  '/login',
  validateRequest(UserValidation.loginSchema),
  UserController.userLogin
);

/**
 * Route to handle user logout.
 * @route POST /logout
 * @access Public
 * @controller UserController.userLogout - Controller function to handle the logout
 */
UserRoutes.post(
  '/logout',
  UserController.userLogout
);

/**
 * Route to handle admin registration.
 * @route POST /registration/admin
 * @access Restricted to ADMIN and SUPER_ADMIN
 * @middleware validateRequest - Middleware to validate the request body against the employeeSchema
 * @middleware authGuard - Middleware to check if the user has ADMIN or SUPER_ADMIN role
 * @controller UserController.adminRegistration - Controller function to handle the admin registration
 */
UserRoutes.post(
  '/registration/admin',
  validateRequest(UserValidation.employeeSchema),
  authGuard('ADMIN', 'SUPER_ADMIN'),
  UserController.adminRegistration
);

/**
 * Route to handle project manager registration.
 * @route POST /registration/project-manager
 * @access Restricted to ADMIN and SUPER_ADMIN
 * @middleware validateRequest - Middleware to validate the request body against the employeeSchema
 * @middleware authGuard - Middleware to check if the user has ADMIN or SUPER_ADMIN role
 * @controller UserController.projectManagersRegistration - Controller function to handle the project manager registration
 */
UserRoutes.post(
  '/registration/project-manager',
  validateRequest(UserValidation.employeeSchema),
  authGuard('ADMIN', 'SUPER_ADMIN'),
  UserController.projectManagersRegistration
);

/**
 * Route to handle engineer registration.
 * @route POST /registration/engineer
 * @access Restricted to ADMIN and SUPER_ADMIN
 * @middleware validateRequest - Middleware to validate the request body against the employeeSchema
 * @middleware authGuard - Middleware to check if the user has ADMIN or SUPER_ADMIN role
 * @controller UserController.engineersRegistration - Controller function to handle the engineer registration
 */
UserRoutes.post(
  '/registration/engineer',
  validateRequest(UserValidation.employeeSchema),
  authGuard('ADMIN', 'SUPER_ADMIN'),
  UserController.engineersRegistration
);

/**
 * Route to handle client registration.
 * @route POST /registration/client
 * @access Restricted to ADMIN and SUPER_ADMIN
 * @middleware validateRequest - Middleware to validate the request body against the clientSchema
 * @middleware authGuard - Middleware to check if the user has ADMIN or SUPER_ADMIN role
 * @controller UserController.clientsRegistration - Controller function to handle the client registration
 */
UserRoutes.post(
  '/registration/client',
  validateRequest(UserValidation.clientSchema),
  authGuard('ADMIN', 'SUPER_ADMIN'),
  UserController.clientsRegistration
);

/**
 * Route to handle retrieving user profile information.
 * @route GET /profile/me
 * @access Restricted to ADMIN, SUPER_ADMIN, PROJECT_MANAGER, ENGINEER, CLIENT
 * @middleware authGuard - Middleware to check if the user has one of the specified roles
 * @controller UserController.userProfile - Controller function to handle retrieving the user profile information
 */
UserRoutes.get(
  '/profile/me',
  authGuard('ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER', 'ENGINEER', 'CLIENT'),
  UserController.userProfile
);

/**
 * Route to update a user's active status.
 * @route PUT /:userId/update/active/status
 * @access Restricted to ADMIN and SUPER_ADMIN
 * @middleware validateRequest - Middleware to validate the request body against the updateActiveSchema
 * @middleware authGuard - Middleware to check if the user has ADMIN or SUPER_ADMIN role
 * @controller UserController.userActiveStatusUpdate - Controller function to handle the update
 */
UserRoutes.put(
  '/:userId/update/active/status',
  validateRequest(UserValidation.updateActiveSchema),
  authGuard('ADMIN', 'SUPER_ADMIN'),
  UserController.userActiveStatusUpdate
);

/**
 * Route to soft delete a user.
 * @route DELETE /:userId/soft-delete
 * @access Restricted to ADMIN and SUPER_ADMIN
 * @middleware validateRequest - Middleware to validate the request body against the softDeletedSchema
 * @middleware authGuard - Middleware to check if the user has ADMIN or SUPER_ADMIN role
 * @controller UserController.userSoftDeleted - Controller function to handle the soft delete
 */
UserRoutes.delete(
  '/:userId/soft-delete',
  validateRequest(UserValidation.softDeletedSchema),
  authGuard('ADMIN', 'SUPER_ADMIN'),
  UserController.userSoftDeleted
);
