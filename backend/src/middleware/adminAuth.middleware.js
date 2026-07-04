import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWTforAdmin = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decoded.role !== "admin") {
      throw new ApiError(403, "Forbidden");
    }

    req.admin = decoded;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
