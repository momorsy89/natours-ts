import { AppError } from "../Classes/AppError";
import express from "express";
import ITour from "../Interfaces/ITour";
import { catchAsync } from "../Functions/catchAsync";
import { ApiFeatures } from "../Classes/APIFeatures";
import { IUser } from "../Interfaces/IUser";
import { IReview } from "../Interfaces/IReview";
import mongoose from 'mongoose';

//Model: mongoose.Model<ITour>
//doc: mongoose.Document<ITour>

//creating new doc by client
export const createOne: Function = (Model:mongoose.Model<ITour | IReview>) =>
  catchAsync(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {

      const doc:  mongoose.Document<ITour | IReview> = await Model.create(
        req.body
      );
      res.status(201).json({
        status: "success",
        data: { doc },
      });
    }
  );

//update a doc
export const updateOne: Function =(Model:mongoose.Model<ITour | IReview>) =>
  catchAsync(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const doc: mongoose.Document<ITour | IReview> | null =
        await Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
      if (!doc){
        return next(new AppError("cannot find a document with this id", 400))};
        
      res.status(200).json({
        status: "success",
        data: { doc },
      });
    }
  );

  //delete a doc
export const deleteOne: Function = (Model:mongoose.Model<ITour | IReview | IUser>) =>
catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const doc:  mongoose.Document<ITour | IReview | IUser> | null =
      await Model.findByIdAndDelete(req.params.id);
    if (!doc){
      return next(new AppError("cannot find a document with this id", 400))};
      
    res.status(204).json({
      status: "success",
      data: null
    });
  }
);

//get a doc
export const getOne: Function = (Model:mongoose.Model<ITour | IReview>,popOptions?:string) =>
catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const doc: mongoose.Document<ITour | IReview | IUser> | null =
      await Model.findById(req.params.id).populate(popOptions);
    if (!doc){
      return next(new AppError("cannot find a document with this id", 400))};
      
    res.status(200).json({
      status: "success",
      data: {doc}
    });
  }
);
//get all docs
export const getAll: Function = (Model:mongoose.Model<ITour | IUser | IReview>) =>
catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let filter:object={};
    if(req.params.tourId)filter={tour:req.params.tourId};
    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;
    res.status(200).json({
      status: "sucess",
      results: docs.length,
      data: { docs },
    });
  }
);
