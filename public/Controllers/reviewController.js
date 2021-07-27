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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = exports.deleteReview = exports.updateReview = exports.getReview = exports.getAllReviews = exports.fillTourAndUser = void 0;
const Review_1 = require("../Models/Review");
const Factory = __importStar(require("./handlerFactory"));
//fill tour & user in req body
const fillTourAndUser = (req, res, next) => {
    //nested tour routes
    if (!req.body.tour)
        req.body.tour = req.params.tourId;
    if (!req.body.user)
        req.body.user = req.user.id;
    next();
};
exports.fillTourAndUser = fillTourAndUser;
exports.getAllReviews = Factory.getAll(Review_1.Review);
exports.getReview = Factory.getOne(Review_1.Review);
exports.updateReview = Factory.updateOne(Review_1.Review);
exports.deleteReview = Factory.deleteOne(Review_1.Review);
exports.createReview = Factory.createOne(Review_1.Review);
//# sourceMappingURL=reviewController.js.map