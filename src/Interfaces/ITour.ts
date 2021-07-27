import mongoose from "mongoose";

interface ITour extends mongoose.Document{
    name:string;
    duration:number;
    slug: string;
    maxGroupSize:number;
    difficulty:string;
    price:number;
    ratingsAverage:number;
    ratingsQuantity:number;
    summary:string;
    discription:string;
    priceDiscount:number;
    imageCover:string;
    images:string[];
    startDates:Date[];
    secretTours:boolean;
    startLocation:{type:string,coordinates:number[]};
    locations:{type:string,coordinates:number[]};
    find:Function;
    findById:Function;
    findByIdAndDelete:Function;
    create:Function;
    findByIdAndUpdate:Function
};
export default ITour;