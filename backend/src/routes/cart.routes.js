import { Router } from "express";
const router = Router();
import {verifyJWTforuser} from '../middleware/auth.middleware.js';
import { getUserCart,updateCart,addToCart } from "../controllers/cart.controller.js";

router.route("/get").get(verifyJWTforuser,getUserCart);
router.route("/update").post(verifyJWTforuser,updateCart);
router.route("/add").post(verifyJWTforuser,addToCart);

export default router;