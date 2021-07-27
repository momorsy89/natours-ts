import express from "express";
import * as authController from "../Controllers/authController";
import * as userController from "../Controllers/userController";

const router = express.Router();

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

export default router;
