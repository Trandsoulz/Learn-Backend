import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";
import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      validate: [validator.isEmail, "Enter a valid email"],
    },
    password: {
      type: String,
      select: false,
      required: true,
      minlength: [8, "Password must be a minimum of 8 chars"],
    },
    confirmPassword: {
      type: String,
      select: false,
      required: true,
      validate: {
        validator: function (confirmPassword) {
          return confirmPassword === this.password;
        },
        message: "Passwords are not thesame",
      },
    },
    hashedPassword: {
      type: String,
      select: false,
      // required: [true, "hashedPassword is required"],
    },
    photo: {
      type: String,
      default: process.env.PHOTO,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "super-admin"],
      default: "student",
    },
    changedPassword: {
      type: Date,
      default: Date.now(),
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpires: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: "time_created",
      updatedAt: "time_updated",
    },
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // await bcrypt.hash(this.password, 12, (err, hash) => {
  //   if (err) return next(err);
  //   this.hashedPassword = hash;
  // });
  this.hashedPassword = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});

UserSchema.methods.comparePasswords = function (loginPassword, userPassword) {
  return bcrypt.compare(loginPassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function (JWTTIMESTAMP) {
  const timechangedPassword = Math.floor(this.changedPassword.getTime() / 1000);

  return timechangedPassword > JWTTIMESTAMP;
};

UserSchema.methods.createPasswrodResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const tenMins = 10 * 60 * 1000; // 10 mins
  this.passwordResetTokenExpires = Date.now() + tenMins;

  return resetToken;
};

const UserModel = model("User", UserSchema);

export default UserModel;
