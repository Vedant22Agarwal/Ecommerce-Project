import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets.js";
import { Link, NavLink } from "react-router";
import useShopContext from "../context/ShopContext.jsx";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { setShowSearch, getCountCart, navigate, accessToken, setAccessToken, setCartItems } = useShopContext();
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

  }, [visible]);

  const logout = async (e) => {
    localStorage.removeItem("accessToken");
    setAccessToken("");
    setCartItems({});
    setShowSearch(false);
    navigate("/login");
  }
  return (
    <>
      <div className="flex justify-between items-center py-5 font-medium">
        <Link to={'/'}>
          <img src={assets.logo} className="w-36" alt="" />
        </Link>

        {/* Navigation Links */}
        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          <li>
            <NavLink to="/" className="flex flex-col items-center gap-1">
              {({ isActive }) => (
                <>
                  <p>HOME</p>
                  {isActive && (
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700" />
                  )}
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/collection"
              className="flex flex-col items-center gap-1"
            >
              {({ isActive }) => (
                <>
                  <p>COLLECTION</p>
                  {isActive && (
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700" />
                  )}
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="flex flex-col items-center gap-1">
              {({ isActive }) => (
                <>
                  <p>ABOUT</p>
                  {isActive && (
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700" />
                  )}
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className="flex flex-col items-center gap-1">
              {({ isActive }) => (
                <>
                  <p>CONTACT</p>
                  {isActive && (
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700" />
                  )}
                </>
              )}
            </NavLink>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <img onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            className="w-5.5 cursor-pointer"
            alt=""
          />

          {/* User  */}
          <div className="group relative">
            <img
              onClick={() => {
                if (!accessToken) {
                  navigate("/login");
                } else {
                  setShowProfileMenu(prev => !prev);
                }
              }}
              src={assets.profile_icon}
              className="w-5.5 cursor-pointer"
              alt=""
            />

            {/* On hover options */}
            {
              accessToken &&
              <div
                className={`absolute right-0 top-full pt-3 ${showProfileMenu ? "block" : "hidden"
                  } sm:group-hover:block`}
              >
                <div className="flex flex-col w-44 py-3 bg-white rounded-xl shadow-lg border border-gray-100">
                  <p className="px-5 py-2 cursor-pointer hover:bg-gray-50 hover:text-black transition-all">
                    My Profile
                  </p>
                  <p
                    onClick={() => {
                      navigate("/orders");
                      setShowProfileMenu(false);
                    }} className="px-5 py-2 cursor-pointer hover:bg-gray-50 hover:text-black transition-all">
                    Orders
                  </p>
                  <p onClick={logout} className="px-5 py-2 cursor-pointer hover:bg-gray-50 hover:text-red-500 transition-all">
                    Logout
                  </p>
                </div>
              </div>
            }
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <img
              src={assets.cart_icon}
              alt=""
              className="w-5.5 min-w-5.5 cursor-pointer"
            />
            <p className="absolute -right-1.25 -bottom-1.25 w-4 text-center leading-4 bg-black text-white rounded-full text-[8px] aspect-square">
              {getCountCart()}
            </p>
          </Link>

          {/* Mobile user scroll */}
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            alt=""
            className="sm:hidden w-5.5 cursor-pointer"
          />
        </div>
        {/* sidebar */}
        <div className={`fixed top-0 right-0 bottom-0 bg-white transition-all ${visible ? "w-full" : "w-0"} overflow-hidden`}>
          <div className="flex flex-col text-gray-600">
            <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
              <img src={assets.dropdown_icon} alt="" className="h-4 rotate-180" />
              <p>Back</p>
            </div>
            <NavLink onClick={() => setVisible(false)} className={({ isActive }) => `py-2 pl-6 border ${isActive ? "bg-black text-white" : ""}`} to='/'>HOME</NavLink>
            <NavLink onClick={() => setVisible(false)} className={({ isActive }) => `py-2 pl-6 border ${isActive ? "bg-black text-white" : ""}`} to='/collection'>COLLECTION</NavLink>
            <NavLink onClick={() => setVisible(false)} className={({ isActive }) => `py-2 pl-6 border ${isActive ? "bg-black text-white" : ""}`} to='/about'>ABOUT</NavLink>
            <NavLink onClick={() => setVisible(false)} className={({ isActive }) => `py-2 pl-6 border ${isActive ? "bg-black text-white" : ""}`} to='/contact'>CONTACT</NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
