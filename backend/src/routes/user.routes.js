import { Router } from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  googleLogin,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  updateUserLocation,
  getUserLocation,
} from "../controllers/users.controller.js";
import { verifyJWTforuser } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/google-login").post(googleLogin);
router.route("/admin").post(adminLogin);
router.route("/forgot-password").post(forgotPassword);
router.route("/verify-reset-otp").post(verifyResetOtp);
router.route("/reset-password").post(resetPassword);

router
  .route("/location")
  .get(verifyJWTforuser, getUserLocation)
  .put(verifyJWTforuser, updateUserLocation);

export default router;
