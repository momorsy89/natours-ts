import Tour from "../Models/Tour";
import express from "express";
import * as Factory from "../Controllers/handlerFactory";
import { catchAsync } from "../Functions/catchAsync";
import { AppError } from "../Classes/AppError";

//get best 5 cheap tours
export const top_5_cheap: express.RequestHandler = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    next();
  }
);

//get all tours
export const getAllTours: express.RequestHandler = Factory.getAll(Tour);

//creat a tour
export const createTour: express.RequestHandler = Factory.createOne(Tour);

//get a tour
export const getTour: express.RequestHandler = Factory.getOne(Tour, "reviews");

//update a tour
export const updateTour: express.RequestHandler = Factory.updateOne(Tour);

//update a tour
export const deleteTour: express.RequestHandler = Factory.deleteOne(Tour);

//get tours statistics
export const get_tours_stats: express.RequestHandler = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const stats: object[] = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: null,
          avgRatings: { $avg: "$ratingsAverage" },
          numRatings: { $sum: "$ratingsQuantity" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          numTours: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: { stats },
    });
  }
);

export const monthlyPlan: express.RequestHandler = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const year: number = parseInt(req.params.year);
    const plan: object[] = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },

      {
        $group: {
          _id: { $month: "$startDates" },
          numTours: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      { $addFields: { month: "$_id" } },
      { $project: { _id: 0 } },
      { $sort: { numTours: -1 } },
    ]);
    res.status(200).json({
      status: "success",
      data: { plan },
    });
  }
);

//get tours within distance
export const getToursWithin: express.RequestHandler = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const distance: number = req.params.distance as unknown as number;
    const latlng: string = req.params.latlng;
    const [lat, lng]: number[] = latlng.split(",") as unknown as number[];
    const unit: string = req.params.unit;
    const rad = unit === "mi" ? distance / 3963.2 : distance / 6378.1;
    if (!lat || !lng) {
      return next(new AppError("kindly enter tour location", 400));
    }
    const tours = await Tour.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], rad] } },
    });
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: { tours },
    });
  }
);

export const getAllDistances: express.RequestHandler = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const latlng: string = req.params.latlng;
    const [lat, lng]: number[] = latlng.split(",") as unknown as number[];
    const unit: string = req.params.unit;
    if (!lat || !lng) {
      return next(new AppError("kindly enter tour location", 400));
    }
    const multiplier: number = unit === "mi" ? 0.000621 : 0.001;
    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng * 1, lat * 1],
          },
          distanceField: "distance",
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          name: 1,
          distance: 1,
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      results: distances.length,
      data: distances,
    });
  }
);
