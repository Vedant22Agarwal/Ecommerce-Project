import React, { useState } from 'react'
import useShopContext from '../../context/ShopContext.jsx'
import { assets } from '../../assets/assets.js';
import { useLocation } from 'react-router';
import { useEffect } from 'react';
const SearchBar = () => {
    const {search,setSearch,setShowSearch,showSearch} = useShopContext();
    const location = useLocation();
    const [visible,setvisible] = useState(false)
    useEffect(() => {
      if(location.pathname.includes("collection")){
        setvisible(true);
      }
      else{
        setvisible(false);
      }
    },[location.pathname]);
    
  return showSearch && visible ? (
    <>
    <div className='border-t border-b bg-gray-50 text-center'>
        <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4  sm:w-1/2">
            <input type="text" placeholder='Search' className='flex-1 outline-none bg-inherit text-sm' value={search} onChange={(e) => setSearch(e.target.value)} />
            <img src={assets.search_icon} alt="" className='w-4 ' />
        </div>
        <img onClick={() => setShowSearch(false)} src={assets.cross_icon} alt="" className='w-3 inline cursor-pointer' />

    </div>
    </>
  ) : null;
}

export default SearchBar    