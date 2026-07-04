import React, { useEffect,useState } from 'react'
import useShopContext from '../../context/ShopContext.jsx'
import {Title,ProductItem} from "../index.js"

const RelativeProduct = ({category,subCategory}) => {
  const {products} = useShopContext();
  const [related, setRelated] = useState([]);
  useEffect(() => {
    if(products.length > 0){
      let productcpy = products.slice();
      productcpy = productcpy.filter((item) => (item.category === category && item.subCategory === subCategory));
      // console.log(productcpy.slice(0,5));
      
      setRelated(productcpy.slice(0,5));
    }
  },[products]);
  return (
    <>
    <div className='my-24'>
      <div className="text-center text-3xl py-2">
        <Title text1 = {"RELATED"} text2 = {"PRODUCTS"}></Title>
      </div>
       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {
          related.map((item,index) => {
            return (
              <ProductItem key={index}
                name={item.name}
                id={item._id}
                price={item.price * 4}
                image={item.image}
                />
            )
          })
        }
       </div>
    </div>
    </>
  )
}

export default RelativeProduct 