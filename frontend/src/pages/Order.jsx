import React, { useState } from 'react'
import { Title } from '../components/index.js'
import useShopContext from '../context/ShopContext.jsx'
import axios, { all } from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const Order = () => {
  const { backendURL, currency, accessToken } = useShopContext();
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    if (!accessToken) return;

    try {
      const response = await axios.get(
        `${backendURL}/api/order/userorders`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data.data);
      if (response.data.success) {
        let allOrderData = [];
        response.data.data.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date
            allOrderData.push(item)
          })
        })
        console.log(allOrderData);
        
        setOrderData(allOrderData.reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went Wrong");
    }
  };
  useEffect(() => {
    if (!accessToken) return;

    loadOrderData();
  }, [accessToken]);
  return (
    <>
      <div className="border-t pt-16">
        <div className="text-2xl">
          <Title text1={"MY"} text2={"ORDERS"}></Title>
        </div>
        <div>
          {
            orderData.map((item, index) => {
              return (
                <div className="py-4 border-y border-y-gray-300 flex flex-col md:flex-row md:items-center md:justify-between gap-4" key={index} >
                  <div className="flex items-start gap-6 text-sm ">
                    <img src={item.image[0]} alt="" className='border w-16 sm:w-20 ' />
                    <div>
                      <p className='sm:text-base font-medium'>{item.name}</p>
                      <div className="flex items-center gap-3 mt-2 text-gray-700">
                        <p className='text-lg'>{currency}{item.price}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Size: {item.size}</p>
                      </div>
                      <p>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                       <p>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                    </div>
                  </div>
                  <div className="md:w-1/2 flex justify-between ">
                    <div className="flex items-center gap-2">
                      <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                      <p className='text-sm md:text-base'>{item.status}</p>
                    </div>
                    <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  )
}

export default Order