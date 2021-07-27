"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const Tour_1 = __importDefault(require("./Models/Tour"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("./Models/User"));
const Review_1 = require("./Models/Review");
//connection to Atlas DB
dotenv_1.default.config({ path: "./config.env" });
mongoose_1.default
    .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})
    .then(() => console.log("DB connection online"))
    .catch((e) => console.log("DB connection faild " + e));
const tours = JSON.parse(fs_1.default.readFileSync(`${__dirname}/../app-doc/tours.json`, "utf8"));
const users = JSON.parse(fs_1.default.readFileSync(`${__dirname}/../app-doc/users.json`, "utf8"));
const reviews = JSON.parse(fs_1.default.readFileSync(`${__dirname}/../app-doc/reviews.json`, "utf8"));
const import_data = async () => {
    try {
        await Tour_1.default.create(tours);
        await User_1.default.create(users);
        await Review_1.Review.create(reviews);
        console.log("data was imported");
    }
    catch (err) {
        console.log("data importing faild " + err);
    }
    process.exit();
};
const delete_data = async () => {
    try {
        await Tour_1.default.deleteMany();
        await User_1.default.deleteMany();
        await Review_1.Review.deleteMany();
        console.log("data was deleted");
    }
    catch (err) {
        console.log("data deleteing faild " + err);
    }
    process.exit();
};
//delete_data();
import_data();
//# sourceMappingURL=import-dev-data.js.map