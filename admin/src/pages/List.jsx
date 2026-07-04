import React from 'react'
import { useEffect, useState } from 'react';
import { backendUrl, curreny } from '../App.jsx';
import { useOutletContext } from 'react-router';
import { toast } from 'react-toastify';
import axios from 'axios';



const List = () => {
  const { token } = useOutletContext();

  const [listProduct, setListProduct] = useState([]);
  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(response.data);

      if (response.data) {
        setListProduct(response.data.data);
        // toast.success(response.)
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(`${backendUrl}/api/product/remove`, { id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
  useEffect(() => {
    fetchList();
  }, [])
  return (
    <>
      <div className="w-full">
        <p className="mb-4 text-xl font-semibold text-gray-800">
          All Products List
        </p>

        <div className="flex flex-col">

          {/* Header */}
          <div className="hidden md:grid grid-cols-[80px_3fr_1.5fr_1fr_80px] items-center bg-gray-100 border rounded-t-lg px-5 py-3 font-semibold text-gray-700">
            <p>Image</p>
            <p>Name</p>
            <p>Category</p>
            <p>Price</p>
            <p className="text-center">Action</p>
          </div>

          {/* Products */}
          {listProduct.map((item) => (
            <div
              key={item._id}
              className="relative flex gap-4 p-4 border-b border-x md:grid md:grid-cols-[80px_3fr_1.5fr_1fr_80px] md:items-center bg-white hover:bg-gray-50 transition"
            >
              {/* Image */}
              <img
                src={item.image[0]}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md border"
              />

              {/* Details */}
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {item.name}
                </p>

                {/* Mobile */}
                <div className="mt-1 text-sm text-gray-500 md:hidden">
                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {item.category}
                  </p>
                  <p>
                    <span className="font-medium">Price:</span>{" "}
                    {curreny}
                    {item.price}
                  </p>
                </div>
              </div>

              {/* Desktop Category */}
              <p className="hidden md:block text-gray-600">
                {item.category}
              </p>

              {/* Desktop Price */}
              <p className="hidden md:block font-medium">
                {curreny}
                {item.price}
              </p>

              {/* Desktop Delete */}
              <div className="hidden md:flex justify-center">
                <button
                  onClick={() => removeProduct(item._id)}
                  className="text-red-500 hover:text-red-700 text-xl font-bold transition"
                >
                  ✕
                </button>
              </div>

              {/* Mobile Delete */}
              <button
                onClick={() => removeProduct(item._id)}
                className="absolute top-3 right-3 md:hidden text-red-500 hover:text-red-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default List