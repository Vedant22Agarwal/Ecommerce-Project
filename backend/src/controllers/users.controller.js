import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { User } from "../models/users.models.js";
import validator from "validator";
import jwt from "jsonwebtoken";

const options = {
  httpOnly: true,
  secure: true,
};

const generateAccessToken = () => {
  return jwt.sign({ role: "admin" }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = () => {
  return jwt.sign({ role: "admin" }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const userinfo = await User.findById(userId);
    // console.log(userinfo);
    const accessToken = userinfo.generateAccessToken();
    const refreshToken = userinfo.generateRefreshToken();
    userinfo.refreshToken = refreshToken;
    await userinfo.save({ validateBeforeSave: false }); // then ensure that not go throw DB again just add the data that has been given
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "Empty Feild");
  }
  const userinfo = await User.findOne({ email });
  if (!userinfo) {
    throw new ApiError(404, "User does not exists");
  }

  const comparision = await userinfo.isPasswordCorrect(password);
  if (!comparision) {
    throw new ApiError(401, "Incorrect Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    userinfo._id
  );

  const loggedInUser = await User.findById(userinfo._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options) // cookies setup
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken, // these are used to
          refreshToken,
        },
        "User Logged in Successfully"
      )
    );
});

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if ([name, email, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "Empty Feild");
  }
  const existing_user = await User.findOne({ email });
  if (existing_user) {
    throw new ApiError(409, "User with this email already exists."); // differnt
  }
  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Please enter a valid email");
  }
  if (password.length < 8 || password.length > 20) {
    throw new ApiError(400, "Password must be between 8 to 20");
  }

  const user = await User.create({
    name,
    email,
    password,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    createdUser._id
  );
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: createdUser,
          accessToken, // these are used to
          refreshToken,
        },
        "User Logged in Successfully"
      )
    );
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "Empty Feild");
  }
  if (password.length < 8 || password.length > 20) {
    throw new ApiError(400, "Password must be between 8 to 20");
  }
  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    throw new ApiError(401, "Invalid email or password");
  }
  const accessToken = generateAccessToken();
  const refreshToken = generateRefreshToken();

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Admin logged in successfully"
      )
    );
});


export { loginUser, registerUser, adminLogin };
