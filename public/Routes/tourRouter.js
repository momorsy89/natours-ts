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
const router = express_1.default.Router();
router.route('/').get(tourController.getAllTours);
router.route('/').post(tourController.createTour);
router.route('/:id').patch(tourController.updateTour);
router.route('/:id').delete(tourController.deleteTour);
router.route('/top-5-cheap').get(tourController.top_5_cheap, tourController.getAllTours);
router.route('/tour-stats').get(tourController.get_tours_stats);
router.route('/monthly-plan/:year').get(tourController.monthlyPlan);
router.route('/:id').get(tourController.getTour);
exports.default = router;
//# sourceMappingURL=tourRouter.js.map