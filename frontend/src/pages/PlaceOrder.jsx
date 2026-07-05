import React, { useState } from "react";
import { Title, CartTotal } from "../components/index.js";
import { assets } from "../assets/assets.js";
import useShopContext from "../context/ShopContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const Placeorder = () => {
  const { backendURL, navigate,
    accessToken, cartItems, getCartAmount,
    setCartItems, delivery_fee, products } = useShopContext();


  const [method, setMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });
  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData(data => ({ ...data, [name]: value }))
  }

  const initPayment = (response) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: response.data.data.amount,
      currency: response.data.data.currency,
      order_id: response.data.data.id,
      name: "Order Payment",
      description: "Order Payment",
      receipt: response.data.data.receipt,
      handler: async (paymentResponse) => {
        try {
          const verifyResponse = await axios.post(
            `${backendURL}/api/order/verifyRazorpay`,
            paymentResponse,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (verifyResponse.data.success) {
            toast.success("Payment Successful");
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error("Payment Verification Failed");
            navigate("/cart");
          }
        } catch (error) {
          console.error(error);
          toast.error(
            error.response?.data?.message || "Payment Verification Failed"
          );
        }
      },
    }
    const rzp = new window.Razorpay(options)
    rzp.open();

  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!accessToken) {
  toast.error("Please login first");
  navigate("/login");
  return;
}
    try {
      let orderItem = [];
      for (const items in cartItems) {
        for (const size in cartItems[items]) {
          if (cartItems[items][size] > 0) {
            const itemInfo = structuredClone(products.find(prod => prod._id === items));
            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[items][size];
              orderItem.push(itemInfo);
            }
          }
        }
      }
      let orderData = {
        address: formData,
        items: orderItem,
        amount: getCartAmount() + delivery_fee
      }
      if (method === "cod") {
        const response = await axios.post(`${backendURL}/api/order/place`, orderData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        if (response.data.success) {
          setCartItems({});
          navigate("/orders");
        }
        else {
          toast.error("Something went Wrong");
        }
      }
      if (method == "stripe") {
        const response = await axios.post(`${backendURL}/api/order/stripe`, orderData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        if (response.data.success) {
          const session_url = response.data.data.session_url;
          window.location.replace(session_url);
        }
        else {
          toast.error("Something went Wrong");
        }
      }
      if (method == "razorpay") {
        const response = await axios.post(`${backendURL}/api/order/razorpay`, orderData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        if (response.data.success) {
          console.log(response);
          initPayment(response);
        }
        else {
          toast.error("Something went Wrong");
        }
      }

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went Wrong");
    }
  }


  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[60vh] border-t ">
      {/*  Left side  */}
      <div className="flex flex-col gap-4 w-full sm:max-w-120 ">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3 ">
          <input onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName} required
            type="text"
            placeholder="First name"
            className="border border-gray-300 rounded py-2 px-4 w-full"
          />
          <input
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName} required
            type="text"
            placeholder="Last name"
            className="border border-gray-300 rounded py-2 px-4 w-full"
          />
        </div>
        <input
          onChange={onChangeHandler}
          name="email"
          value={formData.email} required
          type="email"
          placeholder="Email address"
          className="border border-gray-300 rounded py-2 px-4 w-full"
        />
        <input
          onChange={onChangeHandler}
          name="street" value={formData.street} required
          type="text"
          placeholder="Street"
          className="border border-gray-300 rounded py-2 px-4 w-full"
        />
        <div className="flex gap-3 ">
          <input onChange={onChangeHandler}
            name="city" value={formData.city} required
            type="text"
            placeholder="City"
            className="border border-gray-300 rounded py-2 px-4 w-full"
          />
          <input onChange={onChangeHandler}
            name="state" value={formData.state} required
            type="text"
            placeholder="State"
            className="border border-gray-300 rounded py-2 px-4 w-full"
          />
        </div>
        <div className="flex gap-3 ">
          <input onChange={onChangeHandler} name="zipcode" value={formData.zipcode} required
            type="number"
            placeholder="Pin Code"
            className="border border-gray-300 rounded py-2 px-4 w-full no-spinner"
          />
          <input onChange={onChangeHandler} name="country" value={formData.country} required
            type="text"
            placeholder="Country"
            className="border border-gray-300 rounded py-2 px-4 w-full"
          />
        </div>
        <input onChange={onChangeHandler} name="phone" value={formData.phone} required
          type="number"
          placeholder="Contact Number"
          className="border border-gray-300 rounded py-2 px-4 w-full no-spinner"
        />
      </div>

      <div className="mt-8">
        <div className="mt-8 min-w-80 sm:min-w-120">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* Payment method selection */}
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Stripe */}
            <div
              onClick={() => setMethod("stripe")}
              className={`flex items-center gap-3 p-3 px-4 cursor-pointer rounded-lg border
              transition-all duration-300 ease-in-out
              hover:scale-105 hover:shadow-lg hover:border-green-500 hover:bg-green-50
              ${method === "stripe"
                  ? "border-green-500 bg-green-50 shadow-md"
                  : "border-gray-300"
                }`}>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                ${method === "stripe" ? "border-green-500" : "border-gray-400"}`}>
                {method === "stripe" && (
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                )}
              </div>

              <img src={assets.stripe_logo} alt="Stripe" className="h-5 mx-4" />
            </div>

            {/* Razorpay */}
            <div
              onClick={() => setMethod("razorpay")}
              className={`flex items-center gap-3 p-3 px-4 cursor-pointer rounded-lg border
              transition-all duration-300 ease-in-out
              hover:scale-105 hover:shadow-lg hover:border-green-500 hover:bg-green-50
              ${method === "razorpay"
                  ? "border-green-500 bg-green-50 shadow-md"
                  : "border-gray-300"
                }`}>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                ${method === "razorpay" ? "border-green-500" : "border-gray-400"}`}>
                {method === "razorpay" && (
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                )}
              </div>

              <img
                src={assets.razorpay_logo}
                alt="Razorpay"
                className="h-5 mx-4"
              />
            </div>

            {/* Cash on Delivery */}
            <div
              onClick={() => setMethod("cod")}
              className={`flex items-center gap-3 p-3 px-4 cursor-pointer rounded-lg border
              transition-all duration-300 ease-in-out
              hover:scale-105 hover:shadow-lg hover:border-green-500 hover:bg-green-50
              ${method === "cod"
                  ? "border-green-500 bg-green-50 shadow-md"
                  : "border-gray-300"}`}>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                ${method === "cod" ? "border-green-500" : "border-gray-400"}`}>
                {method === "cod" && (
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                )}
              </div>

              <p className="text-gray-700 text-sm font-semibold mx-4 whitespace-nowrap">
                CASH ON DELIVERY
              </p>
            </div>
          </div>
          <div className="w-full text-end mt-8">
            <button type="submit"
              className="bg-black text-white px-16 py-3 text-sm cursor-pointer">PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Placeorder;
