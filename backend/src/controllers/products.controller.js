import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { Product } from "../models/products.models.js";
import { isValidObjectId } from "mongoose";
const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, subCategory, sizes, bestseller } =
    req.body;
  const parsedSizes = JSON.parse(sizes);
  // console.log(req.body);
  // console.log(parsedSizes);

  if (
    !name?.trim() ||
    !description?.trim() ||
    !category?.trim() ||
    !subCategory?.trim() ||
    price.length == 0 ||
    !Array.isArray(parsedSizes) ||
    parsedSizes.length === 0
  ) {
    throw new ApiError(400, "All required fields are required");
  }
  const image1 = req.files?.image1 && req.files?.image1[0];
  const image2 = req.files?.image2 && req.files?.image2[0];
  const image3 = req.files?.image3 && req.files?.image3[0];
  const image4 = req.files?.image4 && req.files?.image4[0];

  const images = [image1, image2, image3, image4].filter(
    (item) => item !== undefined
  );
  //   console.log(images);

  const imageUrls = await Promise.all(
    images.map(async (img) => {
      const uploaded = await uploadOnCloudinary(img.path);
      return uploaded.secure_url;
    })
  );

  const product = await Product.create({
    name,
    description,
    price: Number(price),
    category,
    subCategory,
    sizes: parsedSizes,
    image: imageUrls,
    date: Date.now(),
    bestseller: bestseller === "true",
  });
  res.status(200).json(new ApiResponse(200, product, "Product Added"));
});

const listProduct = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  if (products.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "No products found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, products, "All products fetched successfully"));
});
const removeProduct = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid Product");
  }
  const deletedProduct = await Product.findByIdAndDelete({
    _id: id,
  });
  res
    .status(200)
    .json(new ApiResponse(200, deletedProduct, "Deleted Successfully"));
});

const singleProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!isValidObjectId(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }
  const productInfo = await Product.findById(productId);
  if(!productInfo){
    throw new ApiError(404, "Product not found");
  }
  res.status(200).json(
    new ApiResponse(200,productInfo,"Fetched Successfully!!")
  )
});
export { addProduct, listProduct, removeProduct, singleProduct };
