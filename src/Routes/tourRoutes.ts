import express from "express";
import * as tourController from "../Controllers/tourController";
import * as authController from "../Controllers/authController";
import * as reviewController from "../Controllers/reviewController";
import reviewRouter from '../Routes/reviewRoutes'

const router = express.Router();

router.route("/").get(tourController.getAllTours);

router.route("/").post(authController.protect, tourController.createTour);

router.route("/:id").patch(authController.protect, tourController.updateTour);

router
  .route("/:id")
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

router
  .route("/top-5-cheap")
  .get(tourController.top_5_cheap, tourController.getAllTours);

router.route("/tour-stats").get(tourController.get_tours_stats);

router.route("/monthly-plan/:year").get(tourController.monthlyPlan);

router.route("/:id").get(tourController.getTour);

router.use('/:tourId/reviews',reviewRouter);

router
  .route("/:tourId/reviews")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.createReview
  );

  router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);

  router.route('/distances/:latlng/unit/:unit').get(tourController.getAllDistances);

export default router;
