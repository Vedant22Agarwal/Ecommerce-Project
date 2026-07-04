import { Router } from "express";
const router = Router();
import {verifyJWTforuser} from '../middleware/auth.middleware.js';
import {verifyJWTforAdmin} from '../middleware/adminAuth.middleware.js';
import {placeOrder,placeOrderStripe,placeOrderRazorpay,allOrderforAdminPanels,updateStatusfromAdmin,userOrderData
    ,verifyStripe,verifyRazorpay
} from "../controllers/order.controller.js"

router.route("/place").post(verifyJWTforuser,placeOrder);
router.route("/stripe").post(verifyJWTforuser,placeOrderStripe);
router.route("/razorpay").post(verifyJWTforuser,placeOrderRazorpay);
router.route("/userorders").get(verifyJWTforuser,userOrderData);

router.route("/list").get(verifyJWTforAdmin,allOrderforAdminPanels);
router.route("/status").post(verifyJWTforAdmin,updateStatusfromAdmin);


// verify payment
router.route("/verifyStripe").post(verifyJWTforuser,verifyStripe)
router.route("/verifyRazorpay").post(verifyJWTforuser,verifyRazorpay)

export default router;
