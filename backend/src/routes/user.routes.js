import { Router } from "express";
import {
    loginUser,
    registerUser,
    adminLogin

} from '../controllers/users.controller.js';

const router = Router();


router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/admin").post(adminLogin);



export default router;