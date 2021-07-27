"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
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
//handling of unhandeld rejections
process.on('unhandledRejection', (err) => {
    console.log('unhandeledRejection   shutting down.....');
    console.log(err.name, err.message);
    server.close();
});
//handling of uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('uncaughtException   shutting down.....');
    console.log(err.name, err.message);
    server.close();
});
//to change eviroment
//process.env.NODE_ENV = 'production';
console.log(process.env.NODE_ENV);
const server = app_1.default.listen(3000, () => {
    console.log('listening to port 3000.....');
});
//# sourceMappingURL=server.js.map