import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useShopContext from "../context/ShopContext.jsx";

const ForgotPassword = () => {
  const { backendURL, navigate } = useShopContext();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        `${backendURL}/api/user/forgot-password`,
        {
          email,
        }
      );

      if (response.data.success) {
        toast.success("OTP sent to your email");

        navigate("/verify-otp", {
          state: {
            email,
          },
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-20">

      <div className="inline-flex items-center gap-2 mb-8">
        <p className="prata-regular text-3xl">
          Forgot Password
        </p>

        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      <p className="text-gray-500 text-sm text-center mb-6">
        Enter your email address and we'll send you a
        verification OTP.
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-4"
      >

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-800"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="border mt-2 px-8 py-2 bg-black text-white hover:bg-white hover:text-black transition-all duration-500 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

      </form>

      <p
        onClick={() => navigate("/login")}
        className="text-sm mt-5 cursor-pointer underline"
      >
        Back to Login
      </p>

    </div>
  );
};

export default ForgotPassword;