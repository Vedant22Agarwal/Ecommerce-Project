import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import useShopContext from "../context/ShopContext.jsx";

const VerifyOtp = () => {
  const { backendURL, navigate } = useShopContext();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email not found. Please request OTP again.");
      navigate("/forgot-password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${backendURL}/api/user/verify-reset-otp`,
        {
          email,
          otp,
        }
      );

      if (response.data.success) {
        toast.success("OTP verified successfully");

        const resetToken = response.data.data.resetToken;

        navigate("/reset-password", {
          state: {
            resetToken,
          },
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-20">

      <div className="inline-flex items-center gap-2 mb-8">
        <p className="prata-regular text-3xl">
          Verify OTP
        </p>

        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      <p className="text-gray-500 text-sm text-center mb-6">
        Enter the 6-digit OTP sent to
      </p>

      <p className="text-sm font-medium mb-6">
        {email}
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-4"
      >

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => {
            const value = e.target.value;

            if (/^\d*$/.test(value)) {
              setOtp(value);
            }
          }}
          className="w-full px-3 py-2 border border-gray-800 text-center tracking-[0.5em]"
          required
        />

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="border mt-2 px-8 py-2 bg-black text-white hover:bg-white hover:text-black transition-all duration-500 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

      </form>

      <p
        onClick={() => navigate("/forgot-password")}
        className="text-sm mt-5 cursor-pointer underline"
      >
        Request a new OTP
      </p>

    </div>
  );
};

export default VerifyOtp;