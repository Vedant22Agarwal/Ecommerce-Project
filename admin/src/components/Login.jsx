import React, { useState } from 'react'
import axios from "axios"
import { backendUrl } from "../App.jsx"
import { toast } from 'react-toastify'

const Login = ({ setToken }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const onsubmitHanlder = async (e) => {
        e.preventDefault();
        try {
            console.log(email, password);
            const response = await axios.post(`${backendUrl}/api/user/admin`, { email, password },

            );
            // console.log(response);
            if (response.data.success) {
                setToken(response.data.data.accessToken);
                toast.success(response.data.message);

            }
            else {
               
            }

            // console.log(response.data.data.accessToken);
        }
        catch (error) {
            toast.error("Invalid Email or Password")
        }
    }
    return (
        <>
            <div className="min-h-screen flex items-center justify-center w-full">
                <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
                    <h1 className='text-2xl font-bold mb-4'> Admin Panel</h1>
                    <form onSubmit={onsubmitHanlder}>
                        <div className='mb-3 min-w-72'>
                            <p className='text-sm font-medium mb-2 text-gray-700'>Email Address</p>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" name="" id="" placeholder='your@email.com' required />
                        </div>
                        <div className='mb-3 min-w-72'>
                            <p className='text-sm font-medium mb-2 text-gray-700'>Password</p>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="password" name="" id="" placeholder='Enter your password' required />
                        </div>
                        <button className='bg-black text-white w-full mt-2 py-2 px-4 rounded-md' type='submit'>Login</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login