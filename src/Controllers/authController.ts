import { catchAsync } from "../Functions/catchAsync";
import express from "express";
import { AppError } from "../Classes/AppError";
import User from "../Models/User";
import jwt, { Secret } from "jsonwebtoken";
import { IModifiedRequest } from "../Interfaces/IModifiedRequest";
import crypto from "crypto";
import { IUser } from "../Interfaces/IUser";
import { sendEmail } from "../email";

//create a cookie
const cookieOptinos = {
  expires: new Date(
    Date.now() +
      (process.env.JWT_COOKIE_EXPIRES_IN as unknown as number) *
        24 *
        60 *
        60 *
        1000
  ),
  httpOnly: true,
  secure: false,
};
if (process.env.NODE_ENV === "production") {
  cookieOptinos.secure = true;
}

//token sigining
const signToken: Function = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//signup for new user
export const signup: express.RequestHandler = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      passwordChangedAt: req.body.passwordChangedAt,
      role: req.body.role,
      passwordResetToken: req.body.passwordResetToken,
      passwordResetExpires: req.body.passwordResetExpires,
    });
    const token: string = signToken(newUser._id);
    res.cookie("jwt", token, cookieOptinos);
    res.status(201).json({
      status: "success",
      token,
      user: { newUser },
    });
  }
);

//login the user
export const login: express.RequestHandler = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    //1-check if user entered email and password
    const email: string = req.body.email;
    const password: string = req.body.password;
    if (!email || !password) {
      return next(new AppError("kindly provide an email and password", 400));
    }
    //2-check if email and password are correct
    const user: IUser | null = await User.findOne({ email }).select(
      "+password"
    );
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("wrong email or password", 401));
    }
    //3- signin the user
    const token: string = signToken(user._id);
    res.cookie("jwt", token, cookieOptinos);
    res.status(200).json({
      status: "success",
      token,
    });
  }
);

export const protect: express.RequestHandler = catchAsync(
  async (
    req: IModifiedRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    //1- check if the user has a valid token
    let token: string = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(
        new AppError(
          "you are not authenticated to perform this action kindly login first",
          401
        )
      );
    }
    //2-token verification
    const decoded: any =(jwt.verify)(
      token,
      process.env.JWT_SECRET as Secret
    );
    //3-check if user still exist
    const freshUser: IUser | null = await User.findById(decoded.id);
    if (!freshUser) {
      return next(new AppError("this user is no longer exist", 401));
    }
    //4-check if the password not changed after jwt issuance
    if (freshUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError("password had been changed", 401));
    }
    //to be able to pass freshUser to the next middleware
    req.user = freshUser;

    next();
  }
);

//Authorization
export const restrictTo: Function = (roles: string[]) => {
  return (
    req: IModifiedRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you are not authorized to perform this action", 403)
      );
    }
    next();
  };
};

//forget password
export const forgotPassword: express.RequestHandler = catchAsync(
  async function (
    this: IUser,
    req: IModifiedRequest,
    res: express.Response,
    next: express.NextFunction
  ) {
    //1-check if user entered an existing email
    const user: IUser | null = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("this user is not exisit", 404));
    }
    //2-generate random rest token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    //3-send resetToken to user email
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;
    const message = `if you forgot your password, submit patch request with
   new password and password confirm to:${resetURL}`;
    try {
      await sendEmail({
        email: user.email,
        subject: "your password reset token (valid for 10 mins)",
        message,
      });
      res.status(200).json({
        status: "success",
        msg: "token has been sen to email",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError(
          "something went worng while sending password reset email kindly try again later " +
            err,
          500
        )
      );
    }
  }
);

//reset user password
export const resetPassword: express.RequestHandler = catchAsync(
  async (
    req: IModifiedRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    //1-get the user based on the reset token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user: IUser | null = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gte: Date.now() as unknown as Date },
    });
    if (!user) {
      return next(new AppError("token is invalid or expired", 400));
    }
    //2-change user password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    //3-update password changed at property
    //4- signin the user
    const token: string = signToken(user._id);
    res.cookie("jwt", token, cookieOptinos);
    res.status(200).json({
      status: "success",
      token,
    });
  }
);

//update user password
export const updatePassword: express.RequestHandler = catchAsync(
  async (
    req: IModifiedRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    //1-get the logedin user
    const user: IUser = (await User.findById(req.user.id).select("+password"))!;
    //2-check if the posted current password is correct
    if (
      !(await user.correctPassword(req.body.currentPassword, user.password))
    ) {
      return next(new AppError("kindly enter the old password correctly", 401));
    }
    //3-update user password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();
    //4-login the user
    const token: string = signToken(user._id);
    res.cookie("jwt", token, cookieOptinos);
    res.status(200).json({
      status: "success",
      token,
    });
  }
);
