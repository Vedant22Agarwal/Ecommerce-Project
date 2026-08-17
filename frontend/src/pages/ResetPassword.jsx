import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import useShopContext from "../context/ShopContext.jsx";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const { backendURL, navigate } = useShopContext();
  const location = useLocation();

  const resetToken = location.state?.resetToken;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resetToken) {
      toast.error("Invalid reset session. Please start again.");
      navigate("/forgot-password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 20) {
      toast.error("Password must be between 8 and 20 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${backendURL}/api/user/reset-password`,
        {
          resetToken,
          newPassword,
          confirmPassword,
        }
      );

      if (response.data.success) {
        toast.success("Password reset successfully");

        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-20">
      <div className="inline-flex items-center gap-2 mb-8">
        <p className="prata-regular text-3xl">Reset Password</p>

        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      <p className="text-gray-500 text-sm text-center mb-6">
        Enter your new password below.
      </p>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <div className="relative w-full">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-800"
            required
          />

          <button
            type="button"
            onClick={() => setShowNewPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
          >
            {showNewPassword ? (
              <EyeOff size={18} strokeWidth={1.5} />
            ) : (
              <Eye size={18} strokeWidth={1.5} />
            )}
          </button>
        </div>

        <div className="relative w-full">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-800"
            required
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
          >
            {showConfirmPassword ? (
              <EyeOff size={18} strokeWidth={1.5} />
            ) : (
              <Eye size={18} strokeWidth={1.5} />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="border mt-2 px-8 py-2 bg-black text-white hover:bg-white hover:text-black transition-all duration-500 disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
