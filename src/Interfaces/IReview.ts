import mongoose from "mongoose"

export interface IReview extends mongoose.Document{
    review:string;
    rating:number;
    tour:[];
    user:[];
    createdAt:Date;
    find:Function;
    findById:Function;
    findByIdAndDelete:Function;
    create:Function;
    findByIdAndUpdate:Function
}