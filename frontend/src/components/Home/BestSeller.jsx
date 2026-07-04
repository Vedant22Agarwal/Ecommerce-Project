import React, { useEffect,useState} from 'react'
import useShopContext from '../../context/ShopContext.jsx'
import {Title,ProductItem} from '../index.js'

const BestSeller = () => {
    const {products} = useShopContext();
    const [BestSeller, setBestSeller] = useState([]);
    useEffect(() => {
        const bestProduct = products.filter((item) => {
            return (item.bestseller === true);
        });
        setBestSeller(bestProduct.slice(0,5));

    },[products])
  return (
    <>
        <div className="my-10">
            <div className="text-center text-3xl py-8">
                <Title text1= {"BEST"} text2 = {"SELLERS"}></Title>
                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                Discover the products our customers love most, chosen for their quality, style, value</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {BestSeller.map((item,index) => (
                <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price}/>
              ))}
            </div>
        </div>
    </>
  )
}

export default BestSeller