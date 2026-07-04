import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import axios from "axios"

export const ShopContext = createContext(); // store all cards

const ShopContextProvider = ({ children }) => {
  const [currency, setCurrency] = useState("₹");
  const [delivery_fee, setDeliveryFees] = useState(100);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState(""); // if any thing is written
  const [showSearch, setShowSearch] = useState(false); // collection page mein hi show hona chahiye
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();
  const [products, setProducts] = useState([])

  // check krna h ek baar
  const [accessToken, setAccessToken] = useState("");

  const addtoCart = async (itemId, size) => {
    let copy = structuredClone(cartItems);
    if (!size) {
      toast.error("Select Product Size", {
        theme: "colored",
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
      return;
    }

    if (copy[itemId]) {
      if (copy[itemId][size]) {
        copy[itemId][size] += 1;
      } else {
        copy[itemId][size] = 1;
      }
    } else {
      copy[itemId] = {};
      copy[itemId][size] = 1;
    }
    toast.success("Item Added", {
      theme: "colored",
      position: "top-right",
      pauseOnHover: false,
      autoClose: 1000,
    });
    setCartItems(copy);

    if (accessToken) {
      try {
        const response = await axios.post(
          `${backendURL}/api/cart/add`,
          { itemId, size },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // console.log(response.data);
      } catch (error) {
        toast.error(
        error.response?.data?.message || "Something went wrong"
      );

      }
    }
  }

  const getCountCart = () => {
    let total = 0;
    for (const item in cartItems) {
      for (const size in cartItems[item]) {
        if (cartItems[item][size]) {
          total += cartItems[item][size];
        }
      }
    }
    return total;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
    if (accessToken) {
      try {
        const response = await axios.post(
          `${backendURL}/api/cart/update`,
          { itemId, size, quantity },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // console.log(response.data);
      } catch (error) {
        toast.error(
        error.response?.data?.message || "Something went wrong"
      );
      }
    }
  };

  const getCartAmount = () => {
    let total = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((item) => item._id === items);
      for (const sizes in cartItems[items]) {
        try {
          if (cartItems[items][sizes] > 0) {
            total += itemInfo.price * cartItems[items][sizes];
          }
        } catch (e) { }
      }
    }
    return total;
  };

  const getProduct = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/product/list`)
      // console.log(response.data);

      if (response.data.success) {
        setProducts(response.data.data)
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }

  const getUserCart = async (token) => {
    try {
      const response = await axios.get(`${backendURL}/api/cart/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      // console.log(response.data);

      if (response.data.success) {
        setCartItems(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");

    }
  }

  useEffect(() => {
    getProduct();
  }, [])

  useEffect(() => {
    if (!accessToken && localStorage.getItem("accessToken")) {
      setAccessToken(localStorage.getItem("accessToken"));
      getUserCart(localStorage.getItem("accessToken"));
    }
  }, [])
  return (
    <ShopContext.Provider
      value={{

        products,
        currency,
        delivery_fee,
        setCurrency,
        setDeliveryFees,
        search,
        setSearch,
        setShowSearch,
        showSearch,
        cartItems,
        addtoCart,
        getCountCart,
        updateQuantity,
        getCartAmount,
        setCartItems,

        backendURL,
        navigate,
        accessToken, setAccessToken
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export { ShopContextProvider };

export default function useShopContext() {
  return useContext(ShopContext);
}
