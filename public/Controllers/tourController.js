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
exports.getAllDistances = exports.getToursWithin = exports.monthlyPlan = exports.get_tours_stats = exports.deleteTour = exports.updateTour = exports.getTour = exports.createTour = exports.getAllTours = exports.top_5_cheap = void 0;
const Tour_1 = __importDefault(require("../Models/Tour"));
const Factory = __importStar(require("../Controllers/handlerFactory"));
const catchAsync_1 = require("../Functions/catchAsync");
const AppError_1 = require("../Classes/AppError");
//get best 5 cheap tours
exports.top_5_cheap = catchAsync_1.catchAsync(async (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    next();
});
//get all tours
exports.getAllTours = Factory.getAll(Tour_1.default);
//creat a tour
exports.createTour = Factory.createOne(Tour_1.default);
//get a tour
exports.getTour = Factory.getOne(Tour_1.default, "reviews");
//update a tour
exports.updateTour = Factory.updateOne(Tour_1.default);
//update a tour
exports.deleteTour = Factory.deleteOne(Tour_1.default);
//get tours statistics
exports.get_tours_stats = catchAsync_1.catchAsync(async (req, res, next) => {
    const stats = await Tour_1.default.aggregate([
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
});
exports.monthlyPlan = catchAsync_1.catchAsync(async (req, res, next) => {
    const year = parseInt(req.params.year);
    const plan = await Tour_1.default.aggregate([
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
});
//get tours within distance
exports.getToursWithin = catchAsync_1.catchAsync(async (req, res, next) => {
    const distance = req.params.distance;
    const latlng = req.params.latlng;
    const [lat, lng] = latlng.split(",");
    const unit = req.params.unit;
    const rad = unit === "mi" ? distance / 3963.2 : distance / 6378.1;
    if (!lat || !lng) {
        return next(new AppError_1.AppError("kindly enter tour location", 400));
    }
    const tours = await Tour_1.default.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], rad] } },
    });
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: { tours },
    });
});
exports.getAllDistances = catchAsync_1.catchAsync(async (req, res, next) => {
    const latlng = req.params.latlng;
    const [lat, lng] = latlng.split(",");
    const unit = req.params.unit;
    if (!lat || !lng) {
        return next(new AppError_1.AppError("kindly enter tour location", 400));
    }
    const multiplier = unit === "mi" ? 0.000621 : 0.001;
    const distances = await Tour_1.default.aggregate([
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
});
//# sourceMappingURL=tourController.js.map