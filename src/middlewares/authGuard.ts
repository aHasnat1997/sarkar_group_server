import { NextFunction, Request, RequestHandler, Response } from "express";
import { Token } from "../utils/token";
import config from "../config";
import { UserRole } from "@prisma/client";
import { TTokenPayload } from "../types/token.type";

/**
 * Middleware function to guard API routes based on user roles.
 *
 * @param {...UserRole[]} accessTo - Array of user roles allowed to access the route.
 * @returns {RequestHandler} - Express middleware function.
 */
export const authGuard = (...accessTo: UserRole[]): RequestHandler => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization;
    if (!token) throw new Error('No token found...');

    const userTokenDecode = Token.verify(token, config.TOKEN.ACCESS_TOKEN_SECRET) as TTokenPayload;
    const isRoleMatched = accessTo.find(r => r === userTokenDecode.role);
    if (!isRoleMatched) throw new Error('Unauthorized User...');

    req.user = userTokenDecode;

    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};
