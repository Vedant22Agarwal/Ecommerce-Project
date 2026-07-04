import React, { useEffect, useState } from "react";
import useShopContext from "../../context/ShopContext.jsx";
import {ProductItem, Title} from "../index.js"

const LatestCollection = () => {
  const { products } = useShopContext();
  const [latestproduct,setLatestProduct] = useState([]);
  useEffect(()=>{
    setLatestProduct(products.slice(0,10));
  },[products])
  return (
    <>
        <div className="my-10">
            {/* Heading */}
            <div className="text-center text-3xl py-8">
                <Title text1={'LATEST'} text2={'COLLECTIONS'}/>
              <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                  Stay ahead of the trends with new arrivals that blend elegance, quality, contemporary design
              </p>
            </div>

            {/* Product Item */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
              {/* Yaha agr change krna h ki kitne show karne h latest mein ussnko kr skata h ...last mein krnegee */}
              {latestproduct.map((item,index) => (
                <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price}/>
              ))}
            </div>
        </div>
  </>
  );
};

export default LatestCollection;
