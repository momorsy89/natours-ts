import { AppError } from "../Classes/AppError";
import express from "express";


const handleCastError: Function = (err: any) => {
  const message: string = `invalid ${err.path} cann't be ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicatedField: Function = (
  err: any
) => {
  const value: string = err.keyValue.name;
  const message: string = `dupplicated field value ${value}`;
  return new AppError(message, 400);
};

const handleValidationError: Function = (
  err: any
) => {
    const errors:string[]=Object.values(err.errors).map((el:any)=>el.message);
    const message=`invalid input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError: Function = (
  err: any
) => {
  return new AppError('invalid token kindly login again',401);
};

const handleExpiredError: Function = (
  err: any
) => {
  return new AppError('your token has been expired kindly login again',401);
};

const sendErrorProd: Function = (err: any, res: express.Response) => {
  if (err.isOpertional) {
    res.status(err.statusCode).json({
      status: err.status,
      name: err.name,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "something went very worng",
    });
  }
};

const sendErrorDev: Function = (err: AppError, res: express.Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    name: err.name,
    message: err.message,
    stack: err.stack,
  });
};

export const globalErrorHandler = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
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
    if(err.name==='JsonWebTokenError'){
      error=handleJWTError(error);
    }
    if(err.name==='TokenExpiredError'){
      error=handleExpiredError(error);
    }
    sendErrorProd(error, res);
  } else if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  }
};
