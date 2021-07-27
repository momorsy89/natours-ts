import mongoose from "mongoose";
import Tour from "./Tour";
import ITour from "../Interfaces/ITour";
import { IReview } from "../Interfaces/IReview";

const reviewSchema = new mongoose.Schema(
  {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tour",
        required: [true, "Review must belonge to a tour"],
      },
    ],
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Review must belonge to a user"],
      },
    ],
  },
  {
    // define schema options
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (this: any, next) {
  this.populate("user");
  //this.populate('tour');
  next();
});

//calculate actual average ratings and ratings numbers
reviewSchema.statics.calcAvergeRating = async function (
  this: mongoose.Model<ITour>,
  tourId: string
) {
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
  if(stats.length>0){
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRatings,
    ratingsAverage: stats[0].avgRatings,
  });
}
  else{await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity:0,
    ratingsAverage:4.5,
  })}
};
//calcAvergeRating function call for new review
reviewSchema.post("save", function (this: IReview) {
  (this.constructor as any).calcAvergeRating(this.tour);
 //eval('this.constructor.calcAvergeRating(this.tour)');
});

//calcAvergeRating function call for update/delete a review
reviewSchema.pre(/^findOneAnd/,async function(this:any,next){
  this.reviewDoc =await this.findOne();
  next();
})

reviewSchema.post(/^findOneAnd/,async function(this:any){
 await this.reviewDoc.constructor.calcAvergeRating(this.reviewDoc.tour);
})

//preventing multiple reviews from same user in sam tour
reviewSchema.index({user:1,tour:1},{unique:true});

//creating Review model based on tourSchema
export const Review = mongoose.model("Review", reviewSchema);
