"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Tour_1 = __importDefault(require("./Tour"));
const reviewSchema = new mongoose_1.default.Schema({
    review: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: [1, "rating must be grater than 1"],
        max: [5, "rating must be less than 5"],
    },
    createdAt: { type: Date, default: Date.now() },
    tour: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Tour",
            required: [true, "Review must belonge to a tour"],
        },
    ],
    user: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Review must belonge to a user"],
        },
    ],
}, {
    // define schema options
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
reviewSchema.pre(/^find/, function (next) {
    this.populate("user");
    //this.populate('tour');
    next();
});
//calculate actual average ratings and ratings numbers
reviewSchema.statics.calcAvergeRating = async function (tourId) {
    const stats = await this.aggregate([
        { $match: { tour: tourId } },
        {
            $group: {
                _id: "$tour",
                nRatings: { $sum: 1 },
                avgRatings: { $avg: "$rating" },
            },
        },
    ]);
    if (stats.length > 0) {
        await Tour_1.default.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRatings,
            ratingsAverage: stats[0].avgRatings,
        });
    }
    else {
        await Tour_1.default.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5,
        });
    }
};
//calcAvergeRating function call for new review
reviewSchema.post("save", function () {
    this.constructor.calcAvergeRating(this.tour);
    //eval('this.constructor.calcAvergeRating(this.tour)');
});
//calcAvergeRating function call for update/delete a review
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.reviewDoc = await this.findOne();
    next();
});
reviewSchema.post(/^findOneAnd/, async function () {
    await this.reviewDoc.constructor.calcAvergeRating(this.reviewDoc.tour);
});
//preventing multiple reviews from same user in sam tour
reviewSchema.index({ user: 1, tour: 1 }, { unique: true });
//creating Review model based on tourSchema
exports.Review = mongoose_1.default.model("Review", reviewSchema);
//# sourceMappingURL=Review.js.map