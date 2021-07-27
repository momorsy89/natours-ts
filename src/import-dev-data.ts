import fs from "fs";
import Tour from "./Models/Tour";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./Models/User";
import {Review} from './Models/Review';

//connection to Atlas DB
dotenv.config({ path: "./config.env" });
mongoose
  .connect(process.env.DATABASE!, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection online"))
  .catch((e) => console.log("DB connection faild " + e));

const tours: string[] = JSON.parse(
  fs.readFileSync(`${__dirname}/../app-doc/tours.json`, "utf8")
);
const users: string[] = JSON.parse(
  fs.readFileSync(`${__dirname}/../app-doc/users.json`, "utf8")
);
const reviews: string[] = JSON.parse(
  fs.readFileSync(`${__dirname}/../app-doc/reviews.json`, "utf8")
);

const import_data: Function = async () => {
  try {
    await Tour.create(tours);
    await User.create(users);
    await Review.create(reviews);
    console.log("data was imported");
  } catch (err) {
    console.log("data importing faild " + err);
  }
  process.exit();
};

const delete_data: Function = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("data was deleted");
  } catch (err) {
    console.log("data deleteing faild " + err);
  }
  process.exit();
};
//delete_data();
import_data();
