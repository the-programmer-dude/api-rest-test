import { Router } from "express";
const router = Router();

import usersRoute from "./routes/users";

router.use("/users", usersRoute);

export default router;
