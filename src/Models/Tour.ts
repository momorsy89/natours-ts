import mongoose from "mongoose";
import ITour from '../Interfaces/ITour';
import slugify from "slugify";


//creating schema for tours
const tourSchema = new mongoose.Schema<ITour>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
      maxLength: [40, "name must be less than 40 letters"],
      minLength: [10, "name must be grater than 10 letters"],
      //validate:[validator.isAlpha,'name must be letters only']
    },
    duration: {
      type: Number,
      required: [true, "a tour must have a duration"],
    },
    slug: String,
    maxGroupSize: {
      type: Number,
      required: [true, "a tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "a tour must have a Difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "tour difficulty is either easy or meduim or difficult",
      },
    },

    price: { type: Number, required: [true, "price is required"] },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "rating must be grater than 1"],
      max: [5, "rating must be less than 5"],
      set: (val:number) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: { type: Number, default: 0 },
    summary: {
      type: String,
      required: [true, "a tour must have a summery"],
    },
    discription: {
      type: String,
      trim: true,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val:number,price:number):boolean {
          return val < price;
        },
        message: "price discount must be less than price",
      },
    },
    imageCover: {
      type: String,
      required: [true, "a tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      //select:false
    },
    startDates: [Date],
    secretTours: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    // define schema options
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//virtual property
tourSchema.virtual('durationWeeks').get(function(this:ITour){
  return this.duration/7;
  });

//document middleware
tourSchema.pre('save',function(next){
  this.slug=slugify(this.name);
  next();
})

//query middleware
tourSchema.pre(/^find/,function(this:any,next) {
  this.find({secretTours:{$ne:true}})
  next();
})

//query middleware to populate refrenced data
tourSchema.pre(/^find/,function(this:any,next) {
  this.populate('guides');
  next();
})

//virtual populate of reviews
tourSchema.virtual('reviews',{
  ref:'Review',
  foreignField:'tour',
  localField:'_id'
})

//create index fro startLocation for geospatial query
tourSchema.index({startLocation:'2dsphere'});

//create an index for price for price field
tourSchema.index({price:1});


const Tour=mongoose.model<ITour>('Tour',tourSchema);
export default Tour;
