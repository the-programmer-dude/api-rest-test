import { Router } from "express";
const router = Router();

import { Joi, celebrate } from "celebrate";

import usersController from "../controllers/usersController";
import authController from "../controllers/authController";

import authorizationMiddleware from "../middlewares/authorization";
import adminAccessMiddleware from "../middlewares/admin-access";
import requiresPassMiddleware from "../middlewares/requires-pass";
import checkForUserDeleted from "../middlewares/checkForUserDel";

const UsersControllerClass = new usersController();
const AuthControllerClass = new authController();

//index & update
router.get(
  "/",
  authorizationMiddleware,
  adminAccessMiddleware("admin", "owner"),
  checkForUserDeleted,
  UsersControllerClass.index
);

router.put(
  "/update-me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string(),
      username: Joi.string().min(3),
      email: Joi.string().min(5),
    }),
  }),
  authorizationMiddleware,
  checkForUserDeleted,
  UsersControllerClass.updateMe
);
router.put(
  "/activate-user/:id",
  celebrate({
    params: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  authorizationMiddleware,
  adminAccessMiddleware("admin", "owner"),
  requiresPassMiddleware,
  checkForUserDeleted,
  UsersControllerClass.activate
);

//register and login
router.post(
  "/login",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  AuthControllerClass.login
);

router.post(
  "/register",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      username: Joi.string().required().max(20).min(3),
      email: Joi.string().required().min(5),
      password: Joi.string().required().min(8),
    }),
  }),
  AuthControllerClass.register
);

//getMe & forgotPass
router.get(
  "/get-me",
  authorizationMiddleware,
  checkForUserDeleted,
  AuthControllerClass.getThisUser
);
router.get(
  "/forgot-password",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
    }),
  }),
  AuthControllerClass.forgotPassword
);

//resetPass
router.put(
  "/reset-pass",
  celebrate({
    query: Joi.object().keys({
      token: Joi.string().required(),
    }),
    body: Joi.object().keys({
      password: Joi.string().required(),
      passwordRepeat: Joi.string().required(),
    }),
  }),
  AuthControllerClass.resetPassword
);

//delete-me & activate-me
router.delete(
  "/desactivate-me",
  authorizationMiddleware,
  checkForUserDeleted,
  UsersControllerClass.deleteMe
);

router.put(
  "/activate-me",
  authorizationMiddleware,
  UsersControllerClass.activateMe
);

//this routes goes on the end to not break the others
router.get(
  "/:id",
  celebrate({
    params: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  UsersControllerClass.read
);

router.delete(
  "/:id",
  celebrate({
    params: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  authorizationMiddleware,
  adminAccessMiddleware("admin", "owner"),
  requiresPassMiddleware,
  checkForUserDeleted,
  UsersControllerClass.delete
);

router.put(
  "/:id",
  celebrate({
    body: Joi.object().keys({
      role: Joi.string(),
      name: Joi.string(),
      username: Joi.string(),
      email: Joi.string(),
      password: Joi.string(),
    }),
    params: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  authorizationMiddleware,
  adminAccessMiddleware("admin", "owner"),
  requiresPassMiddleware,
  checkForUserDeleted,
  UsersControllerClass.update
);

export default router;
