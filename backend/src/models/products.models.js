import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      enum: ["Women", "Men", "Kids"], // differnt
      required: true,
    },
    subCategory: {
      type: String,
      enum: ["Topwear", "Bottomwear", "Winterwear"], // differnt
      required: true,
    },
    sizes: {
      type: Array,
      required: true,
    },
    bestseller: {
      type: Boolean,
    },
    date: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema); // differnt
