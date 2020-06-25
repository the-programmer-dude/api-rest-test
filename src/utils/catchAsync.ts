import { Request, Response, NextFunction } from "express";

export default function (functionController: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    functionController(req, res, next).catch((error: Error) => {
      return next(error);
    });
  };
}
