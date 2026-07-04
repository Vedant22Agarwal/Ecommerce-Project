import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import axios from "axios"
import { backendUrl, curreny } from '../App.jsx';
import { useOutletContext } from "react-router"
import { assets } from '../assets/admin_assets/assets.js';
import { toast } from 'react-toastify';
const Orders = () => {
  const { token } = useOutletContext();

  const [orders, setOrders] = useState([]);

  const fetchAllOrder = async () => {
    if (!token) {
      return null;
    }
    try {
      const response = await axios.get(`${backendUrl}/api/order/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(response.data.data);
      if (response.data.success) {
        setOrders(response.data.data);
      }

    } catch (error) {
      console.log(error.message);
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );

    }
  }

  const statusHandler = async (e,orderId) => {
    try {
      const response = await axios.post(`${backendUrl}/api/order/status`,{orderId,status : e.target.value},
        {
          headers : {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      if(response.data.success){
        await fetchAllOrder()
        toast.success(response.data.message,{
          autoClose : 500
        });
      }
    } catch (error) {
      console.log(error.message);
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }

  useEffect(() => {
    if (!token) return;
    fetchAllOrder();
  }, [token])
  return (
    <>
      <h3>Order Page</h3>
      <div>
        {orders.map((order, index) =>
        (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8  my-3 md:my-4 text-xs sm:text-sm text-gray-700">
            <img className='w-12' src={assets.parcel_icon} alt="" />
            <div className="">
              <div>
                {
                  order.items.map((item, index1) => {
                    if (index1 === order.items.length - 1) {
                      return <p className="py-0.5 " key={index1}>{item.name} x {item.quantity} <span>{item.size}</span> </p>
                    }
                    else {
                      return <p className="py-0.5 " key={index1}>{item.name} x {item.quantity} <span>{item.size}</span> , </p>
                    }

                  })
                }
              </div>
              <p className='mt-3 mb-2 font-medium '>{order.address.firstName + " " + order.address.lastName}</p>
              <div>
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + "," + order.address.state + "," + order.address.country + "," + order.address.zipcode}</p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div className="">
              <p className='text-sm sm:text-[15px] '>Items : {order.items.length}</p>
              <p className='mt-3 '>Method : {order.paymentMethod}</p>
              <p>Payment : {order.payment ? "Done" : "Pending"}</p>
              <p>Date : {new Date(order.date).toDateString()}</p>
            </div>
            <p className='text-sm sm:text-[15px]'>{curreny}{order.amount}</p>
            <select onChange={(e) => statusHandler(e,order._id)} value={order.status} className='p-2 font-semibold'>
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </>
  )
}

export default Orders