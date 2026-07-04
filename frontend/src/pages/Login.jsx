import React, { useEffect, useState } from 'react'
import axios from "axios"
import useShopContext from '../context/ShopContext.jsx'
import { toast } from 'react-toastify';
const Login = () => {
  const { backendURL, navigate, accessToken, setAccessToken } = useShopContext();
  const [currentState, setCurrentState] = useState("Login");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (currentState === "Sign Up") {
        // register api
        const response = await axios.post(`${backendURL}/api/user/register`, {
          name,
          email,
          password
        });
        if (response.data.success) {
          setAccessToken(response.data.data.accessToken)
          localStorage.setItem("accessToken", response.data.data.accessToken)
        }
      }
      else {
        // login api
        const response = await axios.post(`${backendURL}/api/user/login`, {
          email,
          password
        });
        if (response.data.success) {
          toast.success("Login Successful")
          setAccessToken(response.data.data.accessToken)
          localStorage.setItem("accessToken", response.data.data.accessToken)
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      )
    }
  }
  useEffect(() => {
    if(accessToken){
      navigate("/");
    }
  },[accessToken])
  return (
    <>
      <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className='prata-regular text-3xl'>{currentState}</p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>
        {currentState === "Login" ? "" : <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800 ' placeholder='Name' required />}
        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800 ' placeholder='Email' required />
        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800 ' placeholder='Password' required />
        <div className='w-full flex justify-between text-sm -mt-2'>
          <p className='cursor-pointer'>Forgot your password? </p>
          {
            currentState === "Login" ?
              <p onClick={() => setCurrentState("Sign Up")} className='cursor-pointer'>Creat Account</p> :
              <p onClick={() => setCurrentState("Login")} className='cursor-pointer'>Login Here</p>
          }
        </div>
        <button className='border mt-4 px-8 py-2 bg-black text-white hover:bg-white hover:text-black transition-all duration-500'>{currentState === "Login" ? "Sign in" : "Sign up"} </button>

      </form>
    </>
  )
}

export default Login