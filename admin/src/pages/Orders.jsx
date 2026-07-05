import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { backendUrl, curreny } from "../App.jsx";
import { useOutletContext } from "react-router";
import { assets } from "../assets/admin_assets/assets.js";
import { toast } from "react-toastify";
const Orders = () => {
  const { token } = useOutletContext();

  const [orders, setOrders] = useState([]);

  const fetchAllOrder = async () => {
    if (!token) {
      return;
    }
    try {
      const response = await axios.get(`${backendUrl}/api/order/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.data);
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: e.target.value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        await fetchAllOrder();
        toast.success(response.data.message, {
          autoClose: 500,
        });
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchAllOrder();
  }, [token]);
  return (
    <div className="w-full px-4 md:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track and manage customer orders.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {orders.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-1 lg:grid-cols-[80px_2fr_1.3fr_0.8fr_1fr] gap-6 rounded-xl border border-gray-200 bg-white p-6 hover:shadow-sm transition-all duration-200"
          >
            {/* Parcel Icon */}
            <div className="flex justify-center lg:justify-start">
              <img
                className="w-14 rounded-lg border border-gray-200 bg-gray-50 p-2"
                src={assets.parcel_icon}
                alt=""
              />
            </div>

            {/* Products & Customer */}
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                Products
              </p>

              <div className="space-y-1">
                {order.items.map((item, index1) => (
                  <p key={index1} className="text-gray-700 leading-6">
                    {item.name}{" "}
                    <span className="font-medium">× {item.quantity}</span>{" "}
                    <span className="text-gray-500">({item.size})</span>
                  </p>
                ))}
              </div>

              <div className="mt-5">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                  Customer
                </p>

                <p className="text-base font-semibold text-gray-800">
                  {order.address.firstName} {order.address.lastName}
                </p>

                <div className="mt-2 space-y-1 text-gray-600 text-sm">
                  <p>{order.address.street}</p>

                  <p>
                    {order.address.city}, {order.address.state}
                  </p>

                  <p>
                    {order.address.country} - {order.address.zipcode}
                  </p>

                  <p>{order.address.phone}</p>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                Order Details
              </p>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium text-gray-800">Items:</span>{" "}
                  {order.items.length}
                </p>

                <p>
                  <span className="font-medium text-gray-800">Method:</span>{" "}
                  {order.paymentMethod}
                </p>

                <p>
                  <span className="font-medium text-gray-800">Payment:</span>{" "}
                  <span
                    className={
                      order.payment
                        ? "text-green-600 font-medium"
                        : "text-orange-500 font-medium"
                    }
                  >
                    {order.payment ? "Done" : "Pending"}
                  </span>
                </p>

                <p>
                  <span className="font-medium text-gray-800">Date:</span>{" "}
                  {new Date(order.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Amount */}
            <div className="flex flex-col">
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                Amount
              </p>

              <p className="text-xl font-semibold text-gray-800">
                {curreny}
                {order.amount}
              </p>
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                Status
              </p>

              <select
                onChange={(e) => statusHandler(e, order._id)}
                value={order.status}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-black focus:outline-none"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
