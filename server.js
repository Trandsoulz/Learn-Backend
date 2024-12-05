import dotenv from "dotenv";
dotenv.config();

import express, { json, urlencoded } from "express";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./src/db/db.js";
import authRoute from "./src/controllers/authController.js";
import globalErrorHandler from "./src/controllers/errorController.js";
import createError from "http-errors";
import userRoute from "./src/controllers/userController.js";
import { cronJob, cronJob2 } from "./helpers/cronJob.js";

const { PORT, NODE_ENV } = process.env;

connectDB();

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

// Templating engine, used to build websites
app.set("view engine", "ejs");
app.set("views", "./src/views");

if (NODE_ENV !== "prod") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

cronJob.start();
cronJob2.start();
// console.log(cronJob.nextDates(6));

app.get("/", (_, res) => {
  res.render("index", {
    status: "success",
    message: "Welcome to the project server",
  });

  // res.send({ status: "success", message: "Welcome to the Auth server" });
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);

app.all("*", (req, res, next) => {
  next(createError(404, `Can't find "${req.originalUrl}" on this server`));
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(
    `Listening on http://localhost:${
      PORT ?? 8800
    } in ${NODE_ENV} environment...`
  );
});
