"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tourRoutes_1 = __importDefault(require("./Routes/tourRoutes"));
const userRoutes_1 = __importDefault(require("./Routes/userRoutes"));
const reviewRoutes_1 = __importDefault(require("./Routes/reviewRoutes"));
const errorController_1 = require("./Controllers/errorController");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const app = express_1.default();
const limiter = express_rate_limit_1.default({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "requests limit exceeded kindly try again later",
});
app.use('/api', limiter);
app.use(helmet_1.default());
app.use(express_mongo_sanitize_1.default());
app.use(hpp_1.default({ whitelist: ['duration'] }));
app.use(express_1.default.json());
app.use("/api/v1/tours", tourRoutes_1.default);
app.use("/api/v1/users", userRoutes_1.default);
app.use('/api/v1/reviews', reviewRoutes_1.default);
app.use(errorController_1.globalErrorHandler);
//handling of unhandeled routes
app.all("*", (req, res, next) => {
    res.status(404).json({
        status: "faild",
        message: `cann't find ${req.originalUrl}`,
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map