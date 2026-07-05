import { Router } from "express";
const router = Router();
import {verifyJWTforuser} from '../middleware/auth.middleware.js';
import { addReview,getProductReviews } from "../controllers/review.controller.js";

router.route("/addReview").post(verifyJWTforuser,addReview);
router.route("/:productId").get(getProductReviews);
export default router;
