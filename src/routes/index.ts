import { Router } from "express";

/**
 * Express Router instance containing all application routes.
 *
 * @type {Router}
 */
export const AllRoutes: Router = Router();

/**
 * Type representing a module's route configuration.
 */
type TModulesRouters = {
  path: string;
  router: Router;
}

/**
 * Array containing configurations of all module routes.
 *
 * @type {TModulesRouters[]}
 */
const moduleRoutes: TModulesRouters[] = [];

// Attach each module's routes to the main AllRoutes router
moduleRoutes.forEach(r => AllRoutes.use(r.path, r.router));
