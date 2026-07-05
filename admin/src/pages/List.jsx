import React from "react";
import { useEffect, useState } from "react";
import { backendUrl, curreny } from "../App.jsx";
import { useOutletContext } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";

const List = () => {
  const { token } = useOutletContext();

  const [listProduct, setListProduct] = useState([]);
  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);

      if (response.data) {
        setListProduct(response.data.data);
        // toast.success(response.)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  useEffect(() => {
    fetchList();
  }, []);
  return (
    <div className="w-full px-4 md:px-8 py-6">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Product List</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your store products.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-[90px_3fr_1.4fr_1fr_90px] items-center rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm font-semibold text-gray-700">
          <p>Image</p>
          <p>Product</p>
          <p>Category</p>
          <p>Price</p>
          <p className="text-center">Action</p>
        </div>

        {/* Product Cards */}
        {listProduct.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-1 md:grid-cols-[90px_3fr_1.4fr_1fr_90px] gap-5 items-center rounded-xl border border-gray-200 bg-white px-5 py-4 hover:shadow-sm transition-all duration-200"
          >
            {/* Image */}
            <div>
              <p className="md:hidden text-xs uppercase tracking-wide text-gray-400 mb-2">
                Image
              </p>

              <img
                src={item.image[0]}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover border border-gray-200"
              />
            </div>

            {/* Product */}
            <div>
              <p className="md:hidden text-xs uppercase tracking-wide text-gray-400 mb-1">
                Product
              </p>

              <p className="font-semibold text-gray-800 text-base">
                {item.name}
              </p>
            </div>

            {/* Category */}
            <div>
              <p className="md:hidden text-xs uppercase tracking-wide text-gray-400 mb-1">
                Category
              </p>

              <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                {item.category}
              </span>
            </div>

            {/* Price */}
            <div>
              <p className="md:hidden text-xs uppercase tracking-wide text-gray-400 mb-1">
                Price
              </p>

              <p className="text-lg font-semibold text-gray-800">
                {curreny}
                {item.price}
              </p>
            </div>

            {/* Action */}
            <div>
              <p className="md:hidden text-xs uppercase tracking-wide text-gray-400 mb-2">
                Action
              </p>

              <button
                onClick={() => removeProduct(item._id)}
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

export default List;
