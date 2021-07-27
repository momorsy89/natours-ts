import express from "express";
//better handling for async functions
export const catchAsync: Function = (fn: Function) => {
    return (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      fn(req, res, next).catch(next);
    };
  };
  