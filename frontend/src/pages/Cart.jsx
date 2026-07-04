import React, { useEffect, useState } from "react";
import { Title } from "../components/index.js";
import useShopContext from "../context/ShopContext.jsx";
import { assets } from "../assets/assets.js";
import { CartTotal } from "../components/index.js";
import { toast } from "react-toastify";
const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    navigate,
    getCartAmount,
  } = useShopContext();
  const [cartData, setCartData] = useState([]);
  useEffect(() => {
    if(products.length > 0){
      const temp = [];
    for (const items in cartItems) {
      for (const size in cartItems[items]) {
        if (cartItems[items][size] > 0) {
          temp.push({
            _id: items,
            size,
            quantity: cartItems[items][size],
          });
        }
      }
    }
    // console.log(temp);
    setCartData(temp);
    }
    
  }, [cartItems,products]);
  return (
    <>
      <div className="border-t pt-14">
        <div className="text-2xl mb-3">
          <Title text1={"YOUR"} text2={"CART"}></Title>
        </div>

        {/* Produtcs included by user  */}
        <div>
          {cartData.map((item, index) => {
            const productData = products.find(
              (items) => items._id === item._id,
            );
            return (
              <div
                key={index}
                className="py-4 border-y border-gray-300 text-gray-700 grid grid-cols-[4fr_1fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5] items-center gap-4"
              >
                <div className="flex sm:flex-row items-start gap-6">
                  <img
                    src={productData.image[0]}
                    alt=""
                    className="w-16 sm:w-20 border"
                  />
                  <div>
                    <p className="text-xs font-medium sm:text-lg">
                      {productData.name}
                    </p>
                    <div className="flex items-center gap-5 mt-4">
                      <p>
                        {currency}
                        {productData.price}
                      </p>
                      <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50 text-black">
                        {item.size}
                      </p>
                    </div>
                  </div>
                </div>
                <input
                  type="number"
                  min={1}
                  max={100}
                  defaultValue={item.quantity}
                  onChange={(e) =>
                    e.target.value === "0" || e.target.value === ""
                      ? null
                      : updateQuantity(
                          item._id,
                          item.size,
                          Number(e.target.value),
                        )
                  }
                  className="w-14 sm:w-20 h-10 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <img
                  src={assets.bin_icon}
                  alt=""
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  className="w-7 cursor-pointer"
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-end my-20">
          <div className="w-full sm:w-112.5">
            <CartTotal />
            <div className="w-full text-end">
              <button
                onClick={(e) => {
                  if (getCartAmount() === 0) {
                    toast.info("Please select at least one product.", {
                      position: "top-center",
                      autoClose: 2000,
                      theme: "colored",
                      closeOnClick: true,
                      pauseOnHover: false,
                    });
                    return;
                  } else {
                    return navigate("/place-order");
                  }
                }}
                className="bg-black text-white text-sm py-3 px-8 mt-8"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
