import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";

const Reviews = () => {
  const { token } = useOutletContext();

  const [reviews, setReviews] = useState([]);

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${backendUrl}/api/review/delete/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchReviews();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/review/allReviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="w-full px-4 md:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Customer Reviews
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage customer reviews and moderate inappropriate content.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="hidden md:grid grid-cols-[80px_2fr_1.3fr_0.8fr_2.5fr_1fr_80px] items-center rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm font-semibold text-gray-700">
          <p>Image</p>
          <p>Product</p>
          <p>User</p>
          <p>Rating</p>
          <p>Comment</p>
          <p>Date</p>
          <p className="text-center">Action</p>
        </div>

        {reviews.map((review) => (
          <div
            key={review._id}
            className="grid grid-cols-1 md:grid-cols-[80px_2fr_1.3fr_0.8fr_2.5fr_1fr_80px] gap-5 md:gap-3 items-center rounded-xl border border-gray-200 bg-white px-5 py-4 hover:shadow-sm transition-all duration-200"
          >
            {/* Image */}
            <div>
              <p className="md:hidden text-xs uppercase tracking-wide text-gray-400 mb-2">
                Image
              </p>

              <img
                src={review.product.image[0]}
                alt=""
                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
              />
            </div>

            {/* Product */}
            <div>
              <p className="md:hidden text-xs uppercase tracking-wide text-gray-400 mb-1">
                Product
              </p>

              <p className="font-medium text-gray-800">{review.product.name}</p>
            </div>

            {/* User */}
            <div>
              <p className="md:hidden text-xs uppercase tracking-wide text-gray-400 mb-1">
                User
              </p>

              <p className="text-gray-700">{review.user.name}</p>
            </div>

            {/* Rating */}
            <div>
              <p className="md:hidden text-xs uppercase tracking-wide text-gray-400 mb-1">
                Rating
              </p>

              <div className="text-yellow-500 tracking-wide text-base">
                {"★".repeat(review.rating)}
                <span className="text-gray-300">
                  {"★".repeat(5 - review.rating)}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <p className="md:hidden text-xs uppercase tracking-wide text-gray-400 mb-1">
                Comment
              </p>

              <p className="text-gray-600 leading-6 wrap-anywhere">
                {review.comment}
              </p>
            </div>

            {/* Date */}
            <div>
              <p className="md:hidden text-xs uppercase tracking-wide text-gray-400 mb-1">
                Date
              </p>

              <p className="text-gray-600">
                {new Date(review.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Delete */}
            <div>
              <p className="md:hidden text-xs uppercase tracking-wide text-gray-400 mb-2">
                Action
              </p>

              <button
                onClick={() => deleteReview(review._id)}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-500 hover:border-red-300 hover:bg-red-50 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
