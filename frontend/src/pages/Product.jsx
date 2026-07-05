import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useShopContext from "../context/ShopContext.jsx";
import { assets } from "../assets/assets.js";
import { RelativeProduct } from "../components/index.js";
import { toast } from "react-toastify";
import axios from "axios";

const Product = () => {
  const { productId } = useParams();

  const { products, currency, addtoCart, accessToken, backendURL } =
    useShopContext();
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");

  const [size, setSize] = useState("");

  // Review Section
  const [activeTab, setActiveTab] = useState("description");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const fetchData = () => {
    const product = products.find((item) => item._id === productId);

    // console.log(productData);
    if (product) {
      setProductData(product);

      setImage(product.image[0]);
    }
  };
  useEffect(() => {
    fetchData();
  }, [productId, products]);

  const onclickforsizes = (e, item) => {
    if (size.length > 0 && size === item) {
      setSize("");
    } else {
      setSize(item);
    }
  };

  const getReviews = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/review/${productId}`);

      if (response.data.success) {
        setReviews(response.data.data.reviews);
        setAverageRating(response.data.data.averageRating);
        setTotalReviews(response.data.data.totalReviews);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      const response = await axios.post(
        `${backendURL}/api/review/addReview`,
        {
          productId,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success(response.data.message);

      setRating(0);
      setComment("");

      await getReviews();

      // console.log(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (productId) {
      getReviews();
    }
  }, [productId]);
  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, [productId]);
  return productData ? (
    <>
      <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
        <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row  ">
          <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row ">
            <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.5%] w-full ">
              {productData.image.map((item, index) => {
                return (
                  <img
                    onClick={() => setImage(item)}
                    src={item}
                    key={index}
                    className="w-[24%] sm:w-full sm:mb-3 shrink-0 cursor-pointer"
                  />
                );
              })}
            </div>
            <div className="w-full sm:w-[80%]">
              <img className="w-full h-auto" src={image} alt="" />
            </div>
          </div>
          {/* Prodct intfo */}
          <div className="flex-1 ">
            <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-amber-400 text-lg">
                {"★".repeat(Math.floor(averageRating))}
                {"☆".repeat(5 - Math.floor(averageRating))}
              </span>

              <span className="text-gray-700 font-medium">{averageRating}</span>

              <span className="text-gray-500">({totalReviews} Reviews)</span>
            </div>
            <p className="mt-5 text-3xl font-medium">
              {" "}
              {currency}
              {productData.price}
            </p>
            <p className="mt-5 text-gray-400 md:w-4/5">
              {productData.description}
            </p>
            <div className="flex flex-col gap-4 my-8">
              <p className="text-xl font-base">Select Size</p>
              <div className="flex gap-2">
                {productData?.sizes.map((item, index) => {
                  return (
                    <button
                      key={index}
                      onClick={(e) => onclickforsizes(e, item)}
                      className={`border w-10 h-10 bg-gray-100 ${item == size ? "border-orange-500" : ""}`}
                    >
                      {item}{" "}
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              onClick={() => addtoCart(productData._id, size)}
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
            >
              ADD TO CART
            </button>
            <hr className="mt-5 sm:w-4/5" />
            <div className="flex flex-col gap-1 mt-5 text-sm text-gray-500">
              <p className="">100% Original product</p>
              <p className="">Cash on delivery is available on this product</p>
              <p className="">Easy return and exchange policy within 7 days</p>
            </div>
          </div>
        </div>
      </div>
      {/* description and review section */}
      <div className="mt-20">
        <div className="flex">
          <button
            onClick={() => setActiveTab("description")}
            className={`border px-5 py-3 text-sm ${
              activeTab === "description"
                ? "font-semibold bg-white"
                : "text-gray-500"
            }`}
          >
            Description
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`border px-5 py-3 text-sm ${
              activeTab === "reviews"
                ? "font-semibold bg-white"
                : "text-gray-500"
            }`}
          >
            Reviews ({totalReviews})
          </button>
        </div>
        {activeTab === "description" && (
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
            <p>
              An e-commerce website is an online platform that facilitates the
              buying and selling of products or services over the internet. It
              serves as a virtual marketplace where businesses and individuals
              can showcase their products, interact with customers, and conduct
              transactions without the need for a physical presence. E-commerce
              websites have gained immense popularity due to their convenience,
              accessibility, and the global reach they offer.
            </p>
            <p>
              E-commerce websites typically display products or services along
              with detailed descriptions, images, prices, and any available
              variations (e.g., sizes, colors). Each product usually has its own
              dedicated page with relevant information.
            </p>
          </div>
        )}
        {activeTab === "reviews" && (
          <div className="border px-6 py-6">
            <h2 className="text-xl font-semibold mb-6">Customer Reviews</h2>
            <div className="mb-6 border-b pb-4">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-2xl">
                  {"★".repeat(Math.floor(averageRating))}
                  {"☆".repeat(5 - Math.floor(averageRating))}
                </span>

                <span className="text-xl font-semibold">{averageRating}/5</span>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Based on {totalReviews} reviews
              </p>
            </div>

            {/* Write Review Section */}
            <div className="border rounded-lg p-5 mb-8">
              <h3 className="text-lg font-medium">Write a Review</h3>

              {accessToken ? (
                // Review Form
                <div className="mt-3">
                  <p className="text-sm font-medium mb-1">Your Rating</p>

                  <div className="flex items-center gap-1 text-lg">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`leading-none transition-transform duration-150 hover:scale-110 ${
                          star <= rating ? "text-amber-400" : "text-gray-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">
                      Your Review
                    </label>

                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      className="w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <button
                    onClick={handleSubmitReview}
                    className="mt-4 bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    Submit Review
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  Please login to write a review.
                </p>
              )}
            </div>

            <div className="h-87.5 overflow-y-auto space-y-6 pr-2">
              {reviews.map((review) => (
                <div key={review._id} className="border-b pb-5">
                  <div className="flex justify-between">
                    <h4 className="font-semibold">{review.user.name}</h4>
                    <span className="text-sm text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-amber-400 text-lg">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>

                  <p className="mt-2 text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Display related  */}
      <RelativeProduct
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
