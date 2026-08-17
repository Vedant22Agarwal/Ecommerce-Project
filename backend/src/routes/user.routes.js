import { Router } from "express";
import {
    loginUser,
    registerUser,
    adminLogin,
    googleLogin,
    forgotPassword,
    verifyResetOtp,
    resetPassword

} from '../controllers/users.controller.js';

const router = Router();


router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/google-login").post(googleLogin);
router.route("/admin").post(adminLogin);
router.route("/forgot-password").post(forgotPassword);
router.route("/verify-reset-otp").post(verifyResetOtp);
router.route("/reset-password").post(resetPassword);



export default router;