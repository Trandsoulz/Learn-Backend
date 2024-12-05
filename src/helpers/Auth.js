import dotenv from "dotenv";
dotenv.config();

import { promisify } from "util";
import jwt from "jsonwebtoken";
import catchAsync from "./CatchAsync.js";
import createError from "http-errors";
import UserModel from "../models/userModel.js";

const { JWT_EXPIRES_IN, JWT_SECRET } = process.env;

function createToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

const protectRoute = catchAsync(async (req, res, next) => {
  let token;

  // ! First, get the token
  if (
    req.headers["authorization"] &&
    req.headers["authorization"].startsWith("Bearer")
  ) {
    token = req.headers["authorization"].split(" ")[1];
    // console.log(token);
  } else {
    return next(
      createError(401, "You are unauthorised to access this endpoint")
    );
  }

  // ! Verify token

  const { id, iat, exp } = await promisify(jwt.verify)(token, JWT_SECRET);
  // console.log(decoded);

  // ! Check if user exists

  const currentUser = await UserModel.findById(id).select("+hashedPassword");

  if (!currentUser)
    return next(createError(404, "User with this id does not exist"));

  // ! Check if user changed password after the token was issued

  const timePasswordChanged = await currentUser.changedPasswordAfter(iat);
  // This will return true or false console.log(timePasswordChanged);

  if (timePasswordChanged)
    return next(
      createError(
        403,
        "User changed password after verification token was issued"
      )
    );

  //   console.log("Protected route in the house");
  req.user = currentUser;
  next();
});

const adminHandler = (...roles) => {
  return catchAsync(async (req, res, next) => {
    // ! Anywhere this admin route is defined, admins are the only ones that can perform actions on that route

    // const user = req.id;
    // // console.log("This is a user", user);
    // const userRole = await user.role;

    // if (roles.includes(userRole))
    //   return console.log("This person is authorised");

    if (!roles.includes(req.user.role))
      return next(
        createError(403, `A ${req.user.role}, can not access this route`)
      );

    next();
  });
};

export { createToken, protectRoute, adminHandler };
