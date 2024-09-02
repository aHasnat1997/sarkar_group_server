import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { ProjectValidation } from "./projects.validation";
import { ProjectController } from "./projects.controllers";

// Create a new instance of Express Router
export const ProjectRoutes = Router();

ProjectRoutes.post(
  '/create',
  authGuard('SUPER_ADMIN', 'ADMIN'),
  validateRequest(ProjectValidation.projectSchema),
  ProjectController.create
);

ProjectRoutes.get(
  '/all',
  authGuard('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'ENGINEER', 'CLIENT'),
  ProjectController.getAll
);

ProjectRoutes.get(
  '/:id',
  authGuard('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'ENGINEER', 'CLIENT'),
  ProjectController.getSingle
);

ProjectRoutes.patch(
  '/:id/update',
  authGuard('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER'),
  validateRequest(ProjectValidation.updateSchema),
  ProjectController.updateSingle
);

ProjectRoutes.post(
  '/:id/add-engineer',
  authGuard('SUPER_ADMIN', 'ADMIN'),
  validateRequest(ProjectValidation.addEngineer),
  ProjectController.addEngineer
);

ProjectRoutes.post(
  '/:id/remove-engineer',
  authGuard('SUPER_ADMIN', 'ADMIN'),
  validateRequest(ProjectValidation.removeEngineer),
  ProjectController.removeEngineer
);

ProjectRoutes.post(
  '/:id/add-product',
  authGuard('SUPER_ADMIN', 'ADMIN'),
  validateRequest(ProjectValidation.addProduct),
  ProjectController.addProduct
);

ProjectRoutes.post(
  '/:id/remove-product',
  authGuard('SUPER_ADMIN', 'ADMIN'),
  validateRequest(ProjectValidation.removeProduct),
  ProjectController.removeProduct
);
