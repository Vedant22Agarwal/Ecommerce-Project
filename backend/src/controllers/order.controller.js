import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/orders.models.js";
import { User } from "../models/users.models.js";
import Stripe from "stripe";
import razorpay from "razorpay";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const frontendURL = process.env.FRONTEND_URL;

const currency = "inr";
const delivery = 100;

//  COD
const placeOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { items, amount, address } = req.body;

  if (!items || !amount || !address) {
    throw new ApiError(400, "Items, amount and address are required");
  }

  const {
    firstName,
    lastName,
    email,
    street,
    city,
    state,
    zipcode,
    country,
    phone,
  } = address;

  if (
    [
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipcode,
      country,
      phone,
    ].some((field) => !field || field.toString().trim() === "")
  ) {
    throw new ApiError(400, "All address fields are required");
  }
  const newPlaceOrder = await Order.create({
    userId,
    items,
    amount,
    address,
    paymentMethod: "COD",
    payment: false,
    date: Date.now(),
  });

  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        cartData: {},
      },
    },
    {
      new: true,
    }
  );

  res.status(201).json(new ApiResponse(201, newPlaceOrder, "Order Placed"));
});

// Using stripe
const placeOrderStripe = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { items, amount, address } = req.body;

  if (!items || !amount || !address) {
    throw new ApiError(400, "Items, amount and address are required");
  }

  const {
    firstName,
    lastName,
    email,
    street,
    city,
    state,
    zipcode,
    country,
    phone,
  } = address;

  if (
    [
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipcode,
      country,
      phone,
    ].some((field) => !field || field.toString().trim() === "")
  ) {
    throw new ApiError(400, "All address fields are required");
  }
  const newPlaceOrder = await Order.create({
    userId,
    items,
    amount,
    address,
    paymentMethod: "Stripe",
    payment: false,
    date: Date.now(),
  });

  const line_item = items.map((item) => ({
    price_data: {
      currency: currency,
      product_data: {
        name: item.name,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  line_item.push({
    price_data: {
      currency: currency,
      product_data: {
        name: "Delivery Charges",
      },
      unit_amount: delivery * 100,
    },
    quantity: 1,
  });

  const session = await stripe.checkout.sessions.create({
    success_url: `${frontendURL}/verify?success=true&orderId=${newPlaceOrder._id}`,
    cancel_url: `${frontendURL}/verify?success=false&orderId=${newPlaceOrder._id}`,
    line_items: line_item,
    mode: "payment",
  });
  res
    .status(200)
    .json(new ApiResponse(200, { session_url: session.url }, "Stipe URL"));
});

// Verify Stripe
const verifyStripe = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orderId, success } = req.body;

  if (success === "true") {
    await Order.findByIdAndUpdate(orderId, {
      $set: {
        payment: true,
      },
    });

    await User.findByIdAndUpdate(userId, {
      $set: {
        cartData: {},
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Stripe Payment Done"));
  }

  await Order.findByIdAndDelete(orderId);

  return res.status(200).json({
    success: false,
    message: "Stripe Payment Failed",
  });
});

// using razorpay
const placeOrderRazorpay = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { items, amount, address } = req.body;

  if (!items || !amount || !address) {
    throw new ApiError(400, "Items, amount and address are required");
  }

  const {
    firstName,
    lastName,
    email,
    street,
    city,
    state,
    zipcode,
    country,
    phone,
  } = address;

  if (
    [
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipcode,
      country,
      phone,
    ].some((field) => !field || field.toString().trim() === "")
  ) {
    throw new ApiError(400, "All address fields are required");
  }
  const newPlaceOrder = await Order.create({
    userId,
    items,
    amount,
    address,
    paymentMethod: "Razorpay",
    payment: false,
    date: Date.now(),
  });

  const razorpayOptions = {
    currency: currency.toUpperCase(),
    amount: amount * 100,
    receipt: newPlaceOrder._id.toString(),
  };

  const order = await razorpayInstance.orders.create(razorpayOptions);

  res.status(200).json(new ApiResponse(200, order, "Razorpay Order Created"));
});

// Verify Razorpay
const verifyRazorpay = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { razorpay_order_id } = req.body;

  const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

  if (orderInfo.status !== "paid") {
    throw new ApiError(400, "Payment Failed");
  }

  await Order.findByIdAndUpdate(orderInfo.receipt, {
    $set: {
      payment: true,
    },
  });

  await User.findByIdAndUpdate(userId, {
    $set: {
      cartData: {},
    },
  });

  return res.status(200).json(new ApiResponse(200, {}, "Payment Successful"));
});

// All order for admin panels
const allOrderforAdminPanels = asyncHandler(async (req, res) => {
  await Order.deleteMany({
    payment: false,
    paymentMethod: {
      $in: ["Stripe", "Razorpay"],
    },
  });

  const orders = await Order.find({});
  if (!orders) {
    throw new ApiError(500, "Server Issue");
  }
  res.status(200).json(new ApiResponse(200, orders, "All User Data"));
});

// User Order
const userOrderData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Delete unpaid online-payment orders
  await Order.deleteMany({
    userId,
    payment: false,
    paymentMethod: {
      $in: ["Stripe", "Razorpay"],
    },
  });

  const userOrders = await Order.find({ userId });

  res
    .status(200)
    .json(new ApiResponse(200, userOrders, "User Orders fetched Successfully"));
});

const updateStatusfromAdmin = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;
  const orderinfo = await Order.findByIdAndUpdate(
    orderId,
    {
      $set: {
        status,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json(new ApiResponse(200, orderinfo, "Updated Succesfully"));
});
export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrderforAdminPanels,
  updateStatusfromAdmin,
  userOrderData,
  verifyStripe,
  verifyRazorpay,
};
