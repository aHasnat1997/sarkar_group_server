import { Router } from "express";
import { UserRoutes } from "../modules/users/users.routes";
import { EmailTest } from "../views/tests/emailTemp";
import { AdminRoutes } from "../modules/admins/admins.routes";
import { ProjectManagerRoutes } from "../modules/projectManagers/projectManagers.routes";
import { EngineerRoutes } from "../modules/engineers/engineers.routes";
import { ClientRoutes } from "../modules/clients/clients.routes";
import { ProductRoutes } from "../modules/products/products.routes";
import { CrewRoutes } from "../modules/crews/crews.routes";
import { ProjectRoutes } from "../modules/projects/projects.routes";
import { ProjectGalleryRoutes } from "../modules/projectGalleries/projectGalleries.routes";

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
    path: '/test',
    router: EmailTest
  },
  {
    path: '/user',
    router: UserRoutes
  },
  {
    path: '/admin',
    router: AdminRoutes
  },
  {
    path: '/project-manager',
    router: ProjectManagerRoutes
  },
  {
    path: '/engineer',
    router: EngineerRoutes
  },
  {
    path: '/client',
    router: ClientRoutes
  },
  {
    path: '/project',
    router: ProjectRoutes
  },
  {
    path: '/project-gallery',
    router: ProjectGalleryRoutes
  },
  {
    path: '/product',
    router: ProductRoutes
  },
  {
    path: '/crew',
    router: CrewRoutes
  }
];

// Attach each module's routes to the main AllRoutes router
moduleRoutes.forEach(r => AllRoutes.use(r.path, r.router));
