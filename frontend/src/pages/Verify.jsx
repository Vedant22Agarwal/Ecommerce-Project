import React from 'react'
import useShopContext from '../context/ShopContext.jsx'
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
const Verify = () => {
    const { navigate, setCartItems, backendURL, accessToken } = useShopContext();
    const [searchParams] = useSearchParams();

    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    const verifyPayment = async () => {
        try {
            if (!accessToken) return;

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
            toast.error(error.response?.data?.message || "Payment verification failed");
        }
    };
    useEffect(() => {
        if (!accessToken) return;
        verifyPayment();
    }, [accessToken])
    return (
        <>
            <div className=""></div>
        </>
    )
}

export default Verify