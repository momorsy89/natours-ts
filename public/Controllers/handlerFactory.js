"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.getOne = exports.deleteOne = exports.updateOne = exports.createOne = void 0;
const AppError_1 = require("../Classes/AppError");
const catchAsync_1 = require("../Functions/catchAsync");
const APIFeatures_1 = require("../Classes/APIFeatures");
//Model: mongoose.Model<ITour>
//doc: mongoose.Document<ITour>
//creating new doc by client
const createOne = (Model) => catchAsync_1.catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: "success",
        data: { doc },
    });
});
exports.createOne = createOne;
//update a doc
const updateOne = (Model) => catchAsync_1.catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!doc) {
        return next(new AppError_1.AppError("cannot find a document with this id", 400));
    }
    ;
    res.status(200).json({
        status: "success",
        data: { doc },
    });
});
exports.updateOne = updateOne;
//delete a doc
const deleteOne = (Model) => catchAsync_1.catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new AppError_1.AppError("cannot find a document with this id", 400));
    }
    ;
    res.status(204).json({
        status: "success",
        data: null
    });
});
exports.deleteOne = deleteOne;
//get a doc
const getOne = (Model, popOptions) => catchAsync_1.catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id).populate(popOptions);
    if (!doc) {
        return next(new AppError_1.AppError("cannot find a document with this id", 400));
    }
    ;
    res.status(200).json({
        status: "success",
        data: { doc }
    });
});
exports.getOne = getOne;
//get all docs
const getAll = (Model) => catchAsync_1.catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId)
        filter = { tour: req.params.tourId };
    const features = new APIFeatures_1.ApiFeatures(Model.find(filter), req.query)
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
});
exports.getAll = getAll;
//# sourceMappingURL=handlerFactory.js.map