import React, { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import useShopContext from "../context/ShopContext.jsx";

const Verify = () => {
    const { navigate, setCartItems, backendURL, accessToken } = useShopContext();
    const [searchParams] = useSearchParams();

    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    const verifyPayment = async () => {
        try {
            if (!accessToken) return;

            if (!success || !orderId) {
                toast.error("Invalid payment details");
                navigate("/cart");
                return;
            }

            const response = await axios.post(
                `${backendURL}/api/order/verifyStripe`,
                {
                    success,
                    orderId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );  
            console.log(response.data);
            if (response.data.success) {
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
                error.response?.data?.message || "Payment verification failed"
            );
            navigate("/cart");
        }
    };

    useEffect(() => {
        verifyPayment();
    }, [accessToken, success, orderId]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
    );
};

export default Verify;