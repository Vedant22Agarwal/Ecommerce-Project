import { Outlet } from "react-router";
import { Navbar, Footer,SearchBar } from "./components/index.js";
import {ShopContextProvider} from "./context/ShopContext.jsx"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <ShopContextProvider>
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">

         <ToastContainer  icon={true}/>
          <Navbar />
          <SearchBar/>
          <Outlet />
          <Footer />
        </div>
      </ShopContextProvider>
    </>
  );
};

export default App;
