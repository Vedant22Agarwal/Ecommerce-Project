import React from "react";
import { assets } from "../assets/assets.js";

const Footer = () => {
  return (
    <>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} alt="" className="mb-5 w-32" />
          <p className="w-full md:w-2/3 text-gray-600">
            Your destination for trendy fashion, quality products, and a
            seamless shopping experience. Discover styles you'll love at prices
            you'll appreciate
          </p>
        </div>
        <div>
          <p className="mb-5 text-xl font-medium">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600 ">
            <li className="hover:underline">Home</li>
            <li className="hover:underline">About us</li>
            <li className="hover:underline">Delivery</li>
            <li className="hover:underline">Privacy Policy</li>
          </ul>
        </div>
        <div>
          <p className="mb-5 text-xl font-medium">Get in Touch</p>
          <ul className="flex flex-col gap-1 text-gray-600 ">
            <li className="hover:underline">+91-1234567890</li>
            <li className="hover:underline">contactForever@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="py-5 text-sm text-center">Copyright 2026@ forever.com - All Right Reserved</p>
    </>
  );
};

export default Footer;
