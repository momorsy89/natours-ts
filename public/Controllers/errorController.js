"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const AppError_1 = require("../Classes/AppError");
const handleCastError = (err) => {
    const message = `invalid ${err.path} cann't be ${err.value}`;
    return new AppError_1.AppError(message, 400);
};
const handleDuplicatedField = (err) => {
    const value = err.keyValue.name;
    const message = `dupplicated field value ${value}`;
    return new AppError_1.AppError(message, 400);
};
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `invalid input data ${errors.join('. ')}`;
    return new AppError_1.AppError(message, 400);
};
const handleJWTError = (err) => {
    return new AppError_1.AppError('invalid token kindly login again', 401);
};
const handleExpiredError = (err) => {
    return new AppError_1.AppError('your token has been expired kindly login again', 401);
};
const sendErrorProd = (err, res) => {
    if (err.isOpertional) {
        res.status(err.statusCode).json({
            status: err.status,
            name: err.name,
            message: err.message,
        });
    }
    else {
        res.status(500).json({
            status: "error",
            message: "something went very worng",
        });
    }
};
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        name: err.name,
        message: err.message,
        stack: err.stack,
    });
};
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "production") {
        let error = { ...err };
        if (err.name === "CastError") {
            error = handleCastError(error);
        }
        if (err.code === 11000) {
            error = handleDuplicatedField(error);
        }
        if (err.name === "ValidationError") {
            error = handleValidationError(error);
        }
        if (err.name === 'JsonWebTokenError') {
            error = handleJWTError(error);
        }
        if (err.name === 'TokenExpiredError') {
            error = handleExpiredError(error);
        }
        sendErrorProd(error, res);
    }
    else if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    }
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=errorController.js.map