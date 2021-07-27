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
const authController = __importStar(require("../Controllers/authController"));
const userController = __importStar(require("../Controllers/userController"));
const router = express_1.default.Router();
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);
router
    .route("/updatePassword")
    .patch(authController.protect, authController.updatePassword);
router.route("/").get(userController.getAllUsers);
router
    .route("/me")
    .get(authController.protect, userController.getMe, userController.getUser);
router.route("/:id").get(userController.getUser);
router.route("/:id").delete(userController.deleteUser);
router
    .route("/updateMe")
    .patch(authController.protect, userController.updateMe);
router
    .route("/deleteMe")
    .patch(authController.protect, userController.deleteMe);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map