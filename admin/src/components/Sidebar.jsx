import React from 'react'
import { NavLink } from 'react-router'
import { assets } from '../assets/admin_assets/assets.js'

const Sidebar = () => {
  return (
    <>
      <div className="w-[18%] min-h-screen border-r-2">
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
          <NavLink to={"/add"}
            className={({ isActive }) => `flex items-center text-center flex-col sm:flex-row  sm:gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${isActive ? "bg-[#ffebf5] border-[#C586A5]" : ""}`}
          >
            <img src={assets.add_icon} alt="" className='w-5 h-5 ' />
            <p className='block '>Add Items</p>
          </NavLink>
          <NavLink to={"/list"}
            className={({ isActive }) => `flex items-center text-center flex-col sm:flex-row  sm:gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${isActive ? "bg-[#ffebf5] border-[#C586A5]" : ""}`}
          >
            <img src={assets.order_icon} alt="" className='w-5 h-5 ' />
            <p className='block'>List Items</p>
          </NavLink>
          <NavLink to={"/orders"}
            className={({ isActive }) => `flex items-center text-center flex-col sm:flex-row  sm:gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${isActive ? "bg-[#ffebf5] border-[#C586A5]" : ""}`}
          >
            <img src={assets.order_icon} alt="" className='w-5 h-5 ' />
            <p className='block'>Orders</p>
          </NavLink>
          <NavLink to={"/reviews"}
            className={({ isActive }) => `flex items-center text-center flex-col sm:flex-row  sm:gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${isActive ? "bg-[#ffebf5] border-[#C586A5]" : ""}`}
          >
            <img src={assets.order_icon} alt="" className='w-5 h-5 ' />
            <p className='block'>Reviews</p>
          </NavLink>
        </div>
      </div>
    </>
  )
}

export default Sidebar