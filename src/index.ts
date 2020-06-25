import express from "express";
import { errors } from "celebrate";

const app = express();

import routes from "./routes";
import errorController from "./controllers/errorController";

app.use(errors());
app.use(express.json());

app.use("/api", routes);

app.use(errorController);

const server = app.listen(8934);

app.all("*", (req, res) =>
  res.status(404).json({ message: "Route not found" })
);

process.on("unhandledRejection", (err: Error) => {
  console.log("Error: " + err.message);
  console.log("Stack: " + err.stack);

  server.close();
});
