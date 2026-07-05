import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets.js";

const Footer = () => {
  return (
    <>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* Logo & Description */}
        <div>
          <img src={assets.logo} alt="Forever Logo" className="mb-5 w-32" />
          <p className="w-full md:w-2/3 text-gray-600">
            Your destination for trendy fashion, quality products, and a
            seamless shopping experience. Discover styles you'll love at prices
            you'll appreciate.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className="mb-5 text-xl font-medium">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/collection" className="hover:underline">
                Collection
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="mb-5 text-xl font-medium">Get in Touch</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              <a href="tel:+911234567890" className="hover:underline">
                +91-1234567890
              </a>
            </li>
            <li>
              <a
                href="mailto:contactForever@gmail.com"
                className="hover:underline"
              >
                contactForever@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <hr />

      <p className="py-5 text-sm text-center">
        Copyright © 2026 forever.com - All Rights Reserved
      </p>
    </>
  );
};

export default Footer;