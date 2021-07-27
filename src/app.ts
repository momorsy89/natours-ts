import express from "express";
import tourRouter from "./Routes/tourRoutes";
import userRouter from "./Routes/userRoutes";
import reviewRouter from './Routes/reviewRoutes';
import { globalErrorHandler } from "./Controllers/errorController";
import rateLimit from "express-rate-limit";
import mongooseSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
const app = express();

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "requests limit exceeded kindly try again later",
});

app.use('/api',limiter);
app.use(helmet());
app.use(mongooseSanitize());
app.use(hpp({whitelist:['duration']}));

app.use(express.json());
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use('/api/v1/reviews',reviewRouter);

app.use(globalErrorHandler);

//handling of unhandeled routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "faild",
    message: `cann't find ${req.originalUrl}`,
  });
});
export default app;
