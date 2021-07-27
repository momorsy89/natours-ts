"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.deleteMe = exports.updateMe = exports.deleteUser = exports.getUser = exports.getAllUsers = void 0;
const Factory = __importStar(require("../Controllers/handlerFactory"));
const User_1 = __importDefault(require("../Models/User"));
const catchAsync_1 = require("../Functions/catchAsync");
const AppError_1 = require("../Classes/AppError");
exports.getAllUsers = Factory.getAll(User_1.default);
exports.getUser = Factory.getOne(User_1.default);
exports.deleteUser = Factory.deleteOne(User_1.default);
//update user data
exports.updateMe = catchAsync_1.catchAsync(async (req, res, next) => {
    //1-check if the user is not updating his password
    if (req.body.password || req.body.confirmPassword) {
        return next(new AppError_1.AppError('if you want to update your password use /updatePassword', 400));
    }
    //2-get the user
    const user = (await User_1.default.findById(req.user.id).select('+password'));
    //3-update user allawable data only
    if (req.body.name) {
        user.name = req.body.name;
    }
    if (req.body.email) {
        user.email = req.body.email;
    }
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
        status: "success",
        user: { user }
    });
});
//delete a user
exports.deleteMe = catchAsync_1.catchAsync(async (req, res, next) => {
    //1-get the user
    const user = (await User_1.default.findById(req.user.id).select('+password'));
    //2-deactivate the user
    user.active = false;
    await user.save({ validateBeforeSave: false });
    res.status(204).json({
        status: "success",
        user: null
    });
});
const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    console.log('me');
    next();
};
exports.getMe = getMe;
//# sourceMappingURL=userController.js.map