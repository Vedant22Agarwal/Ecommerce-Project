import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Review } from "../models/review.models.js";
import mongoose from "mongoose";

const addReview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, rating, comment } = req.body;

  if (!productId || !rating || !comment?.trim()) {
    throw new ApiError(400, "All fields are required");
  }

  const review = await Review.create({
    productId,
    userId,
    rating,
    comment: comment.trim(),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, review, "Review added successfully"));
});
const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid Product Id");
  }

  const result = await Review.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(productId),
      },
    },
    {
      $facet: {
        reviewStats: [
          {
            $group: {
              _id: null,
              averageRating: {
                $avg: "$rating",
              },
              totalReviews: {
                $sum: 1,
              },
            },
          },
        ],

        reviews: [
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $addFields: {
              user: {
                $first: "$user",
              },
            },
          },
          {
            $project: {
              rating: 1,
              comment: 1,
              createdAt: 1,
              "user.name": 1,
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        reviewStats: {
          $first: "$reviewStats",
        },
      },
    },
    {
      $project: {
        reviews: 1,
        averageRating: {
          $ifNull: [
            {
              $round: ["$reviewStats.averageRating", 1],
            },
            0,
          ],
        },
        totalReviews: {
          $ifNull: ["$reviewStats.totalReviews", 0],
        },
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      result[0] || {
        averageRating: 0,
        totalReviews: 0,
        reviews: [],
      },
      "All reviews"
    )
  );
});

export { addReview, getProductReviews };
