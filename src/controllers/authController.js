import crypto from "crypto";
import express from "express";
import UserModel from "../models/userModel.js";
import createError from "http-errors";
import catchAsync from "../helpers/CatchAsync.js";
import { createToken, protectRoute } from "../helpers/Auth.js";
import upload from "../../helpers/upload.js";
import { promisify } from "util";
import { uploadImagesFunctionSingle } from "../../helpers/imgUploader.js";
import sendMail from "../../helpers/mailer.js";

const authRoute = express.Router();

authRoute.post(
  "/signup",
  upload.single("image"),
  catchAsync(async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword)
      return next(createError(400, "Please provide the necessary details"));

    const userData = {
      name,
      email,
      password,
      confirmPassword,
    };

    if (req.file) {
      const imgResult = await uploadImagesFunctionSingle(req.file); //Upload and get image from cloudinary
      userData.photo = imgResult;
    }

    const newUser = await UserModel.create({
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    });

    const token = await createToken(newUser._id);

    res
      .set("x-auth-token", `${token}`)
      .status(201)
      .send({
        status: "success",
        message: "User created",
        user: {
          name: newUser.name,
          email: newUser.email,
          photo: newUser.photo,
        },
      });
  })
);

authRoute.post(
  "/login",
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(createError(400, "Input Email and Password"));

    const user = await UserModel.findOne({ email: email }).select(
      "+hashedPassword"
    );

    // const correctPassword = ;

    if (!user || !(await user.comparePasswords(password, user.hashedPassword)))
      return next(createError(401, "Invalid credentials"));

    const token = createToken(user._id);

    res
      .set("x-auth-token", `${token}`)
      .status(200)
      .send({
        status: "success",
        message: "User just loggeed in",
        user: {
          name: user.name,
          role: user.role,
          email: user.email,
          photo: user.photo,
        },
      });
  })
);

authRoute.post(
  "/forgotpasswordresettokenlink",
  catchAsync(async (req, res, next) => {
    // Get user from the body
    if (!req.body.email) return next(createError(400, "No email address set"));

    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) return next(createError(404, "No user with this email"));

    // Generate a reset-password link

    const token = user.createPasswrodResetToken();
    await user.save({ validateModifiedOnly: true });

    const resetTokenUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetPassword/${token}`;

    // Send to mail

    try {
      await sendMail(
        user.email,
        "Password reset token",
        `<p> This is your password reset token ${resetTokenUrl} </p>`
      );
      req.mail = user.email;

      res.status(200).send({
        status: "success",
        message: "Check your email for your reset token",
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;

      await user.save();

      next(
        createError(
          500,
          "An error occured while trying to send the mail, try again later"
        )
      );
    }
  })
);

authRoute.patch(
  "/resetPassword/:resetToken",
  catchAsync(async (req, res, next) => {
    const resetToken = req.params["resetToken"];

    if (!resetToken) return next(createError(400, "There is no reset token"));

    const decodedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await UserModel.findOne({
      passwordResetToken: decodedToken,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;

      return next(createError(400, "Token has expired, or is invalid"));
    }

    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword)
      return next(createError(400, "Passwords are not the same"));

    user.password = password;
    user.confirmPassword = confirmPassword;
    user.changedPassword = Date.now();
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;

    await user.save({ validateBeforeSave: true });

    res.status(200).send({
      status: "success",
      message: "Password has been changed",
    });
  })
);

authRoute.patch(
  "/updatePassword",
  protectRoute,
  catchAsync(async (req, res, next) => {
    // 1. Get user from collection

    const { currentPassword, password, confirmPassword } = req.body;

    const user = req.user;

    // 2. Check if POSTED password matches current hashed password
    if (!(await user.comparePasswords(currentPassword, user.hashedPassword)))
      return next(createError(400, "Current Password is incorrect"));

    // 3. If so, update password

    if (password !== confirmPassword)
      return next(createError(400, "Passwords aren't thesame"));

    user.password = password;
    user.changedPassword = Date.now();
    user.time_updated = Date.now();

    await user.save();

    // 4. Log user in, and profer new JWT

    const token = createToken(user._id);

    res.set("x-auth-token", token).status(200).send({
      status: "success",
      message: "Password has successfully been changed",
    });
  })
);

authRoute.post(
  "/forgotpasswordresettokenotp",
  catchAsync(async (req, res, next) => {
    // Get user from the body
    // Generate an otp
    // Send to mail
  })
);

export default authRoute;
