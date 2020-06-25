import { Request, Response, NextFunction } from "express";

import bcrypt from "bcrypt";
import AppError from "../utils/appError";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const password: string = req.user.user.password;
  const candidatePassword: string = req.body.password;

  if (!candidatePassword)
    return next(
      new AppError(403, "This operation requires password verification")
    );

  const compare: any = await bcrypt.compare(candidatePassword, password);

  if (compare instanceof Error)
    return next(new AppError(403, "Passwords don't match"));

  return next();
}
