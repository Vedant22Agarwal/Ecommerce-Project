import { User } from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
export const verifyJWTforuser = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    const token =
      req.cookies?.accessToken ||
      authHeader?.replace("Bearer ", "");

    console.log("Authorization:", authHeader);
    console.log("Cookie:", req.cookies?.accessToken);
    console.log("Token:", token);

    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const userInfo = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!userInfo) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = userInfo;
    next();
  } catch (error) {
    console.log(error);
    throw new ApiError(401, error.message || "Invalid Access Token");
  }
});