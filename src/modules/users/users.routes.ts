import { Router } from "express";
import { UserController } from "./users.controllers";
import { authGuard } from "../../middlewares/authGuard";

// Create a new Express Router instance
export const UserRoutes = Router();

/**
 * Route to handle user login.
 * @route POST /login
 * @access Public
 */
UserRoutes.post(
  '/login',
  UserController.userLogin
);

/**
 * Route to handle user logout.
 * @route POST /logout
 * @access Public
 */
UserRoutes.post(
  '/logout',
  UserController.userLogout
);

/**
 * Route to handle admin registration.
 * @route POST /registration/admin
 * @access Public
 */
UserRoutes.post(
  '/registration/admin',
  UserController.adminRegistration
);

/**
 * Route to handle project manager registration.
 * @route POST /registration/project-manager
 * @access Restricted to ADMIN and SUPER_ADMIN
 * @middleware authGuard - Middleware to check if the user has ADMIN or SUPER_ADMIN role
 */
UserRoutes.post(
  '/registration/project-manager',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  UserController.projectManagersRegistration
);

/**
 * Route to handle engineer registration.
 * @route POST /registration/engineer
 * @access Restricted to ADMIN and SUPER_ADMIN
 * @middleware authGuard - Middleware to check if the user has ADMIN or SUPER_ADMIN role
 */
UserRoutes.post(
  '/registration/engineer',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  UserController.engineersRegistration
);
