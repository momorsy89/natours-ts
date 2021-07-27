import mongoose  from "mongoose";

export interface IUser extends mongoose.Document{
name:string;
email:string;
passwordChangedAt: Date;
photo: String;
password:string;
confirmPassword:string | undefined;
role:string;
active:boolean;
passwordResetToken: String| undefined;
passwordResetExpires: Date| undefined;
correctPassword:Function;
changedPasswordAfter:Function;
createPasswordResetToken:Function;
find:Function
findById:Function;
findByIdAndDelete:Function
}