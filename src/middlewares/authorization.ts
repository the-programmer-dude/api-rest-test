import { Request, Response, NextFunction, request } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import db from "../db/connection";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
//import IRequest from "../../custom.d.test";
import { promisify } from "util";

const processEnv: any = process.env;
dotenv.config();

export default catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;

    if (!authorization) return next(new AppError(401, "No token provided"));

    const [bearer, token] = authorization.split(" ");

    if (authorization.split(" ").length !== 2)
      return next(new AppError(411, "Token malformatted"));

    if (bearer.toLowerCase() !== "bearer")
      return next(new AppError(401, "Token invalid"));

    const { id }: any = await promisify(jwt.verify)(
      token,
      processEnv.JWT_SECRET
    );

    const findUser = await db("users").where("id", "=", id).select("*").first();
    if (!findUser)
      return next(
        new AppError(403, "The token is valid but the user on it isn't")
      );

    req.user = {
      user: findUser,
      id,
    };

    next();
  }
);
