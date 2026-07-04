import { Router } from "express";
import {
    addProduct,
    listProduct,
    removeProduct,
    singleProduct
} from "../controllers/products.controller.js"
import {upload} from "../middleware/multer.middleware.js"
import multer from "multer";
import { verifyJWTforAdmin } from "../middleware/adminAuth.middleware.js";
const  router = Router();
// only admin can udate 


router.route("/add").post(verifyJWTforAdmin,
    upload.fields([
        {
            name : "image1",
            maxCount:1
        },
        {
            name : "image2",
            maxCount:1
        },
        {
            name : "image3",
            maxCount:1
        },
        {
            name : "image4",
            maxCount:1
        }
    ]),addProduct);
router.route("/remove").post(verifyJWTforAdmin,removeProduct);
router.route("/list").get(listProduct);

router.route("/:productId").get(singleProduct);

export default router;
