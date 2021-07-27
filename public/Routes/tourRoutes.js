"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tourController = __importStar(require("../Controllers/tourController"));
const authController = __importStar(require("../Controllers/authController"));
const reviewController = __importStar(require("../Controllers/reviewController"));
const reviewRoutes_1 = __importDefault(require("../Routes/reviewRoutes"));
const router = express_1.default.Router();
router.route("/").get(tourController.getAllTours);
router.route("/").post(authController.protect, tourController.createTour);
router.route("/:id").patch(authController.protect, tourController.updateTour);
router
    .route("/:id")
    .delete(authController.protect, authController.restrictTo("admin", "lead-guide"), tourController.deleteTour);
router
    .route("/top-5-cheap")
    .get(tourController.top_5_cheap, tourController.getAllTours);
router.route("/tour-stats").get(tourController.get_tours_stats);
router.route("/monthly-plan/:year").get(tourController.monthlyPlan);
router.route("/:id").get(tourController.getTour);
router.use('/:tourId/reviews', reviewRoutes_1.default);
router
    .route("/:tourId/reviews")
    .post(authController.protect, authController.restrictTo("user"), reviewController.createReview);
router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(tourController.getAllDistances);
exports.default = router;
//# sourceMappingURL=tourRoutes.js.map