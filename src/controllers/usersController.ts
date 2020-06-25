import { Request, Response, NextFunction } from "express";
import db from "../db/connection";
import catchAsync from "../utils/catchAsync";
import sendMail from "../utils/mail";
import AppError from "../utils/appError";
//import IRequest from "../../custom.d.test";

function checkIfSomeoneIsDoingBadStuff(req: Request, userToUpdate: any) {
  if (req.body.role === "owner" && req.user.user.role !== "owner") return true;

  if (userToUpdate.role === "owner" && req.user.user.role !== "owner")
    return true;

  return false;
}

function checkIfUserIsDeleted(user: any) {
  return user.deleted ? true : false;
}

function checkIfUserIsDeletedByAdm(user: any) {
  return user.deletedByAdmin ? true : false;
}

export default class usersController {
  //CRUDA
  index = catchAsync(async (req: Request, res: Response) => {
    const queryObj: any = req.query;
    const allowedFields = ["deleted", "fields", "sort", "page", "limit"];

    Object.keys(queryObj).map((field) => {
      if (!allowedFields.includes(field)) {
        delete req.body[field];
      }
    });

    let users: any = db("users");

    if (queryObj.deleted) {
      users = users.where("deleted", queryObj.deleted);
    }

    if (queryObj.fields) {
      users = users.select(
        queryObj.fields.split(",").map((element: any) => element.trim())
      );
    }

    if (queryObj.sort) {
      queryObj.sort = queryObj.sort
        .split(",")
        .map((element: any) => element.trim());
      queryObj.sort.forEach((field: string) => {
        users = users.orderBy(field, "desc");
      });

      users = users.orderBy(queryObj.sort);
    }

    //pagination starts
    const page = queryObj.page * 1 || 1;
    const limit = queryObj.limit * 1 || 10;

    const calculatePagination = page * limit - limit;
    const startIndex = calculatePagination;
    const endIndex = calculatePagination + limit;

    const usersAfterPagination = [];

    for (let i = startIndex; i < endIndex; i++) {
      const usersCopy = await users;
      if (!usersCopy[i]) continue;
      usersAfterPagination.push(usersCopy[i]);
    }

    users = usersAfterPagination;
    //pagination ends

    users = await users;

    users.forEach((obj: any) => {
      obj.password = undefined;
    });

    return res.status(200).json(await users);
  });

  read = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await db("users")
      .select("*")
      .where("id", "=", req.params.id)
      .first();

    if (!user) return next(new AppError(400, "User not found"));

    user.password = undefined;
    return res.json(user);
  });

  update = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const allowedFields = ["role", "name", "username", "email"];

      Object.keys(req.body).map((field) => {
        if (!allowedFields.includes(field)) {
          delete req.body[field];
        }
      });

      const findUserToUpdate = await db("users")
        .select("*")
        .where("id", req.params.id)
        .first();

      if (!findUserToUpdate) return next(new AppError(400, "User not found"));

      const check = checkIfSomeoneIsDoingBadStuff(req, findUserToUpdate);

      if (check)
        return next(new AppError(403, "You are not allowed to do that"));

      if (!findUserToUpdate) return next(new AppError(400, "User not found"));

      const user: any = await db("users")
        .update(req.body)
        .where("id", "=", findUserToUpdate.id)
        .returning("*");

      user.password = undefined;
      return res.status(200).json({ userUpdated: user[0] });
    }
  );

  delete = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id }: any = req.params;
      const findUser: any = await db("users")
        .where("id", "=", req.params.id)
        .first();

      if (!findUser) return next(new AppError(400, "User not found"));
      if (findUser.deleted)
        return next(new AppError(400, "User is already deleted"));

      if (findUser.role !== "user" && req.user.user.role !== "owner")
        return next(
          new AppError(403, "Admins can only desactivate users accounts")
        );

      try {
        sendMail({
          subject: "Account re-activated",
          text: `Sorry! Our moderators have deleted your account, but now this is undone, welcome back!`,
          to: findUser.email,
        });
      } catch (err) {
        return next(
          new AppError(500, "Could not send the email, try again or later")
        );
      }

      await db("users")
        .where("id", "=", id * 1)
        .update({ deleted: true, deletedByAdmin: true });

      return res.status(204).json();
    }
  );

  activate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id }: any = req.params;
      const findUser: any = await db("users")
        .where("id", "=", req.params.id)
        .first();

      if (!findUser) return next(new AppError(400, "User not found"));
      if (!findUser.deleted)
        return next(new AppError(400, "User is already activated"));

      try {
        sendMail({
          subject: "Account deleted",
          text: `Our moderators detect inapropriated behaviour on your account, and so, your account has been terminated, 
          if this is some sort of mistake, please contact us at ulissescarvalho.d@gmail.com`,
          to: findUser.email,
        });
      } catch (err) {
        return next(
          new AppError(500, "Could not send the email, try again or later")
        );
      }

      await db("users")
        .where("id", "=", id * 1)
        .update({ deleted: false, deletedByAdmin: false });

      return res.status(204).json();
    }
  );

  deleteMe = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user.user;

      if (checkIfUserIsDeleted(user))
        return next(new AppError(400, "You are already deleted"));

      await db("users").update("deleted", true).where("id", "=", user.id);

      return res.status(204).send();
    }
  );

  activateMe = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user.user;

      if (!checkIfUserIsDeleted(user))
        return next(new AppError(400, "You are already activated"));

      if (checkIfUserIsDeletedByAdm(user))
        return next(
          new AppError(
            403,
            `Error: cannot activate an account deleted by the admin`
          )
        );

      await db("users").update("deleted", false).where("id", "=", user.id);

      return res.status(204).send();
    }
  );

  updateMe = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user.user;

      const allowedFields = ["name", "username", "email"];

      Object.keys(req.body).map((field) => {
        if (!allowedFields.includes(field)) {
          delete req.body[field];
        }
      });

      const userUpdated: any = await db("users")
        .update(req.body)
        .where("id", "=", user.id)
        .returning("*");

      userUpdated.password = undefined;

      return res.status(200).json(userUpdated);
    }
  );
}
