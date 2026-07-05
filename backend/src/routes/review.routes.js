import { Router } from "express";
const router = Router();
import { verifyJWTforuser } from "../middleware/auth.middleware.js";
import { verifyJWTforAdmin } from "../middleware/adminAuth.middleware.js";
import {
  addReview,
  getProductReviews,
  getAllReviews,
  deleteReview
} from "../controllers/review.controller.js";

router.route("/addReview").post(verifyJWTforuser, addReview);
router.route("/allReviews").get(verifyJWTforAdmin, getAllReviews);

router.route("/delete/:reviewId").delete(verifyJWTforAdmin, deleteReview);
router.route("/:productId").get(getProductReviews);

export default router;
