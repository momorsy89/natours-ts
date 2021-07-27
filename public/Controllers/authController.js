"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.restrictTo = exports.protect = exports.login = exports.signup = void 0;
const catchAsync_1 = require("../Functions/catchAsync");
const AppError_1 = require("../Classes/AppError");
const User_1 = __importDefault(require("../Models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const email_1 = require("../email");
//create a cookie
const cookieOptinos = {
    expires: new Date(Date.now() +
        process.env.JWT_COOKIE_EXPIRES_IN *
            24 *
            60 *
            60 *
            1000),
    httpOnly: true,
    secure: false,
};
if (process.env.NODE_ENV === "production") {
    cookieOptinos.secure = true;
}
//token sigining
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
//signup for new user
exports.signup = catchAsync_1.catchAsync(async (req, res, next) => {
    const newUser = await User_1.default.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role,
        passwordResetToken: req.body.passwordResetToken,
        passwordResetExpires: req.body.passwordResetExpires,
    });
    const token = signToken(newUser._id);
    res.cookie("jwt", token, cookieOptinos);
    res.status(201).json({
        status: "success",
        token,
        user: { newUser },
    });
});
//login the user
exports.login = catchAsync_1.catchAsync(async (req, res, next) => {
    //1-check if user entered email and password
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return next(new AppError_1.AppError("kindly provide an email and password", 400));
    }
    //2-check if email and password are correct
    const user = await User_1.default.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError_1.AppError("wrong email or password", 401));
    }
    //3- signin the user
    const token = signToken(user._id);
    res.cookie("jwt", token, cookieOptinos);
    res.status(200).json({
        status: "success",
        token,
    });
});
exports.protect = catchAsync_1.catchAsync(async (req, res, next) => {
    //1- check if the user has a valid token
    let token = "";
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new AppError_1.AppError("you are not authenticated to perform this action kindly login first", 401));
    }
    //2-token verification
    const decoded = (jsonwebtoken_1.default.verify)(token, process.env.JWT_SECRET);
    //3-check if user still exist
    const freshUser = await User_1.default.findById(decoded.id);
    if (!freshUser) {
        return next(new AppError_1.AppError("this user is no longer exist", 401));
    }
    //4-check if the password not changed after jwt issuance
    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError_1.AppError("password had been changed", 401));
    }
    //to be able to pass freshUser to the next middleware
    req.user = freshUser;
    next();
});
//Authorization
const restrictTo = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError_1.AppError("you are not authorized to perform this action", 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
//forget password
exports.forgotPassword = catchAsync_1.catchAsync(async function (req, res, next) {
    //1-check if user entered an existing email
    const user = await User_1.default.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError_1.AppError("this user is not exisit", 404));
    }
    //2-generate random rest token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    //3-send resetToken to user email
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
    const message = `if you forgot your password, submit patch request with
   new password and password confirm to:${resetURL}`;
    try {
        await email_1.sendEmail({
            email: user.email,
            subject: "your password reset token (valid for 10 mins)",
            message,
        });
        res.status(200).json({
            status: "success",
            msg: "token has been sen to email",
        });
    }
    catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError_1.AppError("something went worng while sending password reset email kindly try again later " +
            err, 500));
    }
});
//reset user password
exports.resetPassword = catchAsync_1.catchAsync(async (req, res, next) => {
    //1-get the user based on the reset token
    const hashedToken = crypto_1.default
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    const user = await User_1.default.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gte: Date.now() },
    });
    if (!user) {
        return next(new AppError_1.AppError("token is invalid or expired", 400));
    }
    //2-change user password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    //3-update password changed at property
    //4- signin the user
    const token = signToken(user._id);
    res.cookie("jwt", token, cookieOptinos);
    res.status(200).json({
        status: "success",
        token,
    });
});
//update user password
exports.updatePassword = catchAsync_1.catchAsync(async (req, res, next) => {
    //1-get the logedin user
    const user = (await User_1.default.findById(req.user.id).select("+password"));
    //2-check if the posted current password is correct
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError_1.AppError("kindly enter the old password correctly", 401));
    }
    //3-update user password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();
    //4-login the user
    const token = signToken(user._id);
    res.cookie("jwt", token, cookieOptinos);
    res.status(200).json({
        status: "success",
        token,
    });
});
//# sourceMappingURL=authController.js.map