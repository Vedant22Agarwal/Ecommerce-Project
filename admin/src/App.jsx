import { Outlet } from "react-router";
import { Login, Navbar, Sidebar } from "./components/index.js";
// import {ShopContextProvider} from "./context/ShopContext.jsx"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const curreny = "₹"

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("accessToken") ?  localStorage.getItem("accessToken") : "");

  useEffect(() => {
    localStorage.setItem("accessToken" , token);
  },[token])

  return (
    <div className="bg-gray-50 min-h-screen ">
      <ToastContainer/>
        {token === "" ? <Login setToken={setToken} /> :
          <>

            {/* <ToastContainer icon={true} /> */}
            <Navbar setToken={setToken} />
            <hr />
            <div className="flex w-full">
              <Sidebar />
              <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
                <Outlet context={{ token }} />
              </div>
            </div>
          </>}
    </div>
  )
}

export default App