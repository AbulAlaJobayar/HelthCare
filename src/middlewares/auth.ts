import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../helper/jwtHelpers";
import config from "../config";
import { Secret } from "jsonwebtoken";
import AppError from "../errors/AppError";
import httpStatus from "http-status";

export const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "user Unauthorized");
      }
      const verifiedUser = verifyToken(token, config.jwt.jwtSecret as Secret);

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "Forbidden");
      }
      req.user = verifiedUser;
      next();
    } catch (error) {
      next(error);
    }
  };
};
