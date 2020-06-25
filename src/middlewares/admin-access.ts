import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

export default (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user: any = req.user.user;

    if (!user) return next(new AppError(403, "Error: none user provided"));

    if (!roles.includes(user.role))
      return next(
        new AppError(403, "Error: you are not allowed to enter in  this route")
      );

    return next();
  };
};
