import { NextFunction, Request, RequestHandler, Response } from "express";
import { AnyZodObject } from "zod";

/**
 * Middleware function to validate incoming request body against a Zod schema.
 *
 * @param {AnyZodObject} schema - The Zod schema object to validate against.
 * @returns {RequestHandler} - Express middleware function.
 */
const validateRequest = (schema: AnyZodObject): RequestHandler => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await schema.parseAsync(req.body);
    return next();
  } catch (err) {
    next(err);
  }
};

export default validateRequest;
