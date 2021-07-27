import * as Factory from "../Controllers/handlerFactory";
import User from "../Models/User";
import express from 'express';
import { catchAsync } from "../Functions/catchAsync";
import { AppError } from "../Classes/AppError";
import { IUser } from "../Interfaces/IUser";
import { IModifiedRequest } from "../Interfaces/IModifiedRequest";

export const getAllUsers: express.RequestHandler =Factory.getAll(User);

export const getUser: express.RequestHandler =Factory.getOne(User);

export const deleteUser: express.RequestHandler =Factory.deleteOne(User);

//update user data
export const updateMe: express.RequestHandler = catchAsync(
    async (
      req: IModifiedRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
        //1-check if the user is not updating his password
        if(req.body.password || req.body.confirmPassword){
            return next(new AppError('if you want to update your password use /updatePassword',400));
        }
        //2-get the user
        const user:IUser = (await User.findById(req.user.id).select('+password'))!;
        //3-update user allawable data only
        if(req.body.name){
            user.name=req.body.name
        }
        if(req.body.email){
            user.email=req.body.email
        }
        await user.save({validateBeforeSave:false});
        res.status(200).json({
            status: "success",
            user:{user}
          });
    });

    //delete a user
    export const deleteMe: express.RequestHandler = catchAsync(
        async (
          req: IModifiedRequest,
          res: express.Response,
          next: express.NextFunction
        ) => {
        //1-get the user
        const user:IUser = (await User.findById(req.user.id).select('+password'))!;
        //2-deactivate the user
        user.active=false;
        await user.save({validateBeforeSave:false})
        res.status(204).json({
            status: "success",
            user:null
          });

        });

export const getMe:any= (req: IModifiedRequest,
res: express.Response,
next: express.NextFunction
) => {
  req.params.id=req.user.id;
  console.log('me')
  next();
};


