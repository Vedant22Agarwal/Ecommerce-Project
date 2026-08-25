import { OAuth2Client } from "google-auth-library";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { User } from "../models/users.models.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendPasswordResetOtp } from "../utils/Email.js";
import redisClient from "../config/redis.js";

const options = {
  httpOnly: true,
  secure: true,
};
// To verify google client id
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

// Google Login user
const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    throw new ApiError(400, "Google credential is required");
  }
  // Now verify google token
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  console.log(payload);

  const { sub: googleId, email, name, email_verified } = payload;
  if (!email || !email_verified) {
    throw new ApiError(401, "Google account email is not verified");
  }

  let user = await User.findOne({ googleId });
  // If Google user doesn't exist,
  // check whether an account with this email already exists
  if (!user) {
    user = await User.findOne({ email });
    // Existing email/password account
    // Link Google account to it
    if (user) {
      user.googleId = googleId;

      await user.save({
        validateBeforeSave: false,
      });
    }
  }

  // Completely new user
  if (!user) {
    user = await User.create({
      name,
      email,
      googleId,
    });
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Google Login Successful"
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

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || email.trim() === "") {
    throw new ApiError(400, "Email is required");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Please enter a valid email");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User with this email does not exist");
  }

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 1000000).toString();
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  const otpKey = `forgot-password:otp:${email}`;

  await redisClient.set(otpKey, hashedOtp, {
    EX: 5 * 60,
  });

  await sendPasswordResetOtp(email, otp);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP generated successfully"));
});

const verifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Please enter a valid email");
  }

  if (!/^\d{6}$/.test(otp)) {
    throw new ApiError(400, "OTP must be 6 digits");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const otpKey = `forgot-password:otp:${email}`;
  const storedHashedOtp = await redisClient.get(otpKey);

  if (!storedHashedOtp) {
    throw new ApiError(401, "OTP has expired or does not exist");
  }

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  
  if (hashedOtp !== storedHashedOtp) {
    throw new ApiError(401, "Invalid OTP");
  }

  redisClient.del(otpKey);
  // Create a temporary reset token
  const resetToken = jwt.sign(
    {
      _id: user._id,
      type: "password-reset",
    },
    process.env.RESET_PASSWORD_TOKEN_SECRET,
    {
      expiresIn: "10m",
    }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        resetToken,
      },
      "OTP verified successfully"
    )
  );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword, confirmPassword } = req.body;

  if (!resetToken || !newPassword || !confirmPassword) {
    throw new ApiError(
      400,
      "Reset token, new password and confirm password are required"
    );
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  if (newPassword.length < 8 || newPassword.length > 20) {
    throw new ApiError(400, "Password must be between 8 and 20 characters");
  }

  // Verify reset token
  let decodedToken;

  try {
    decodedToken = jwt.verify(
      resetToken,
      process.env.RESET_PASSWORD_TOKEN_SECRET
    );
  } catch (error) {
    throw new ApiError(401, "Invalid or expired reset token");
  }

  // Make sure this token is specifically for password reset
  if (decodedToken.type !== "password-reset") {
    throw new ApiError(401, "Invalid reset token");
  }

  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Set new password
  user.password = newPassword;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successfully"));
});

const updateUserLocation = asyncHandler(async (req, res) => {
  const { latitude, longitude, address } = req.body;

  // -----------------------------
  // Validate coordinates
  // -----------------------------

  if (latitude === undefined || longitude === undefined) {
    throw new ApiError(400, "Latitude and longitude are required");
  }

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    throw new ApiError(400, "Latitude and longitude must be numbers");
  }

  if (latitude < -90 || latitude > 90) {
    throw new ApiError(400, "Invalid latitude");
  }

  if (longitude < -180 || longitude > 180) {
    throw new ApiError(400, "Invalid longitude");
  }

  // -----------------------------
  // Update user location
  // -----------------------------

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        location: {
          latitude,
          longitude,

          address: {
            street: address?.street || "",

            city: address?.city || "",

            state: address?.state || "",

            zipcode: address?.zipcode || "",

            country: address?.country || "",
          },
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Location updated successfully"));
});

const getUserLocation = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("location");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        location: user.location || null,
      },
      "Location fetched successfully"
    )
  );
});
export {
  loginUser,
  registerUser,
  adminLogin,
  googleLogin,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  updateUserLocation,
  getUserLocation,
};
