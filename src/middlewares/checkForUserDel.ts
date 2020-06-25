import { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
  if (req.user.user.deleted)
    return res.status(403).json({
      message: "Your user is deleted",
    });

  next();
}
