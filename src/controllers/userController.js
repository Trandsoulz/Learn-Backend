import express from "express";
import catchAsync from "../helpers/CatchAsync.js";
import { adminHandler, protectRoute } from "../helpers/Auth.js";
import UserModel from "../models/userModel.js";
import createError from "http-errors";

import upload from "../../helpers/upload.js";
import { uploadImagesFunctionMultiple } from "../../helpers/imgUploader.js";

const userRoute = express.Router();

userRoute.get(
  "/",
  protectRoute,
  adminHandler("super-admin"),
  catchAsync(async (req, res, next) => {
    const users = await UserModel.find();

    if (!users) return next(createError(404, "No user in the database"));

    res.status(200).send({
      status: "success",
      length: users.length,
      users,
    });
  })
);

userRoute.post(
  "/uploadimage",
  upload.array("image", 7),
  catchAsync(async (req, res, next) => {
    // console.log(req.file);
    // console.log(req.files);

    const imgResults = await uploadImagesFunctionMultiple(req.files);

    res.status(200).send({
      // file: req.files,
      status: "success",
      length: imgResults.length,
      files: imgResults,
    });
  })
);

userRoute.delete(
  "/:userId",
  protectRoute,
  adminHandler("super-admin"),
  catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    await UserModel.findByIdAndDelete(userId);

    res.status(200).send({
      status: "success",
      message: `User with Id "${userId}" has been deleted from the database`,
    });
  })
);

userRoute.patch(
  "/update",
  protectRoute,
  catchAsync(async (req, res, next) => {
    const { password, confirmPassword } = req.body;

    // 1. Create error if they send password

    if (password || confirmPassword)
      return next(createError(400, "Can't update user password"));

    // 2. Update user document

    UserModel.updateOne({})
  })
);

export default userRoute;
