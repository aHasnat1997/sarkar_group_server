import { Router } from "express";
import { UserRoutes } from "../modules/users/users.routes";
import { EmailTest } from "../views/tests/emailTemp";
import { AdminRoutes } from "../modules/admins/admins.routes";

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
 */
const moduleRoutes: TModulesRouters[] = [
  {
    path: '/test/emails',
    router: EmailTest
  },
  {
    path: '/user',
    router: UserRoutes
  },
  {
    path: '/admin',
    router: AdminRoutes
  }
];

// Attach each module's routes to the main AllRoutes router
moduleRoutes.forEach(r => AllRoutes.use(r.path, r.router));
