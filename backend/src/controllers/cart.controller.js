import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.models.js";

const addToCart = asyncHandler(async (req, res) => {
  //   console.log(req.user);
  const { itemId, size } = req.body;
  const userId = req.user._id;
  const userinfo = await User.findById(userId);
  if (!userinfo) {
    throw new ApiError(404, "User not found");
  }
  let cartData = userinfo.cartData || {};
  if (cartData[itemId]) {
    if (cartData[itemId][size]) {
      cartData[itemId][size] += 1;
    } else {
      cartData[itemId][size] = 1;
    }
  } else {
    cartData[itemId] = {};
    cartData[itemId][size] = 1;
  }
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        cartData,
      },
    },
    { new: true }
  );
  res.status(200).json(new ApiResponse(200, {}, "Cart updated successfully"));
});

const updateCart = asyncHandler(async (req, res) => {
  const { itemId, size, quantity } = req.body;
  const userId = req.user._id;
  const userinfo = await User.findById(userId);
  if (!userinfo) {
    throw new ApiError(404, "User not found");
  }
  let cartData = userinfo.cartData || {};
  if (!cartData[itemId]) {
    cartData[itemId] = {};
  }

  cartData[itemId][size] = quantity;
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        cartData,
      },
    },
    { new: true }
  );

  res.status(200).json(new ApiResponse(200, {}, "Cart updated successfully"));
});

const getUserCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const userinfo = await User.findById(userId).select("cartData");

  if (!userinfo) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, userinfo.cartData || {}, "Cart fetched successfully")
    );
});
export { addToCart, updateCart, getUserCart };
