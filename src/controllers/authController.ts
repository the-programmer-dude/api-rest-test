import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

import catchAsync from "../utils/catchAsync";
import db from "../db/connection";
import sendMail from "../utils/mail";
import AppError from "../utils/appError";

dotenv.config();

interface IRequest extends Request {
  userId?: number;
  user?: object;
}

const JWTSECRET: any = process.env.JWT_SECRET;

interface configjwt {
  expiresIn?: string;
}

function generateToken(id: number, expires: boolean) {
  let config: configjwt = {
    expiresIn: "1h",
  };

  if (!expires) config = {};

  return jwt.sign({ id }, JWTSECRET, config);
}

async function generateHash(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return hash;
}

export default class authController {
  register = catchAsync(async (req: Request, res: Response) => {
    const password = await generateHash(req.body.password);

    const user: any = await db("users")
      .insert({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password,
      })
      .returning("*");

    const token = generateToken(user.id, true);
    const refreshToken = generateToken(user.id, false);

    user.password = undefined;

    return res.status(201).json({
      user,
      token,
      refreshToken,
    });
  });

  login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const findUserWithEmailProvided: any = await db("users")
      .where("email", "=", email)
      .select("*")
      .first();

    if (findUserWithEmailProvided === {} || !findUserWithEmailProvided)
      return res.status(400).json({
        message: "Wrong email or password",
      });

    const correct = await bcrypt.compare(
      password,
      findUserWithEmailProvided.password
    );

    if (!correct)
      return res.status(400).json({
        message: "Wrong email or password",
      });

    const token = generateToken(findUserWithEmailProvided.id, true);
    const refreshToken = generateToken(findUserWithEmailProvided.id, false);

    return res.status(200).json({
      token,
      refreshToken,
    });
  });

  getThisUser = catchAsync(async (req: IRequest, res: Response) => {
    return res.status(200).json(req.user);
  });

  forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;

    const token = crypto.randomBytes(32).toString("hex");

    const passwordRecuperation = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const originalDate = new Date();
    originalDate.setHours(new Date().getHours() + 1, 0, 0);
    const passwordValidUntil = new Date(originalDate).toISOString();

    const userToEditPass: any = await db("users")
      .where("email", "=", email)
      .select("*")
      .first();

    if (userToEditPass === {} || !userToEditPass)
      return res.status(400).json({
        message: "Wrong email",
      });

    await db("users")
      .where("id", "=", userToEditPass.id)
      .update("passwordRecuperation", passwordRecuperation)
      .update("passwordExpiresIn", Date.parse(passwordValidUntil));

    try {
      await sendMail({
        to: userToEditPass.email,
        subject: "Password change",
        text: `
        Oh dear! Looks like you've forgot your password and you send an email to reset it, if this is\n
        incorrect, ignore this email, but if you requested to change your password, here is the token: ${token}
        `,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Could not send your email, try again or later",
      });
    }
    return res.status(204).json();
  });

  resetPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { token }: any = req.query;
      const { password, passwordRepeat } = req.body;

      const passwordRecuperation = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const userToUpdate: any = await db("users")
        .where("passwordRecuperation", passwordRecuperation)
        .first();

      if (!userToUpdate) return next(new AppError(400, "User not found"));

      const dateNow: any = Date.now();
      const expiresDate = userToUpdate.passwordExpiresIn;

      if (await bcrypt.compare(req.body.password, userToUpdate.password)) {
        return next(new AppError(400, "Do not use your last password"));
      }

      if (dateNow > expiresDate)
        return res.status(400).json({
          message: "Token expired",
        });

      if (password !== passwordRepeat)
        return res.status(400).json({
          message: "Passwords don't match",
        });

      const hashedPass = await generateHash(password);

      const expiresIn = new Date(
        new Date().setFullYear(new Date().getFullYear() - 1)
      ).toISOString();

      await db("users")
        .where("id", userToUpdate.id)
        .update("passwordExpiresIn", expiresIn)
        .update("password", hashedPass);

      return res.status(200).json({
        message: "Success",
      });
    }
  );
}
