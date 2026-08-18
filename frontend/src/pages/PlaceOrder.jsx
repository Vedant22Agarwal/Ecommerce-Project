import React, { useEffect, useRef, useState } from "react";

import { Title, CartTotal } from "../components/index.js";
import { assets } from "../assets/assets.js";
import useShopContext from "../context/ShopContext.jsx";

import axios from "axios";
import { toast } from "react-toastify";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

// =====================================================
// Fix Leaflet marker icon issue with Vite
// =====================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// =====================================================
// MAP MARKER
// Clicking the map changes the location
// =====================================================

const LocationMarker = ({
  position,
  setPosition,
  getAddressFromCoordinates,
}) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;

      const newPosition = [lat, lng];

      // Update marker
      setPosition(newPosition);

      // Get address for clicked coordinates
      await getAddressFromCoordinates(lat, lng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

// =====================================================
// MAP UPDATER
// When address changes, move the map
// =====================================================

const MapUpdater = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (!position) {
      return;
    }

    map.flyTo(position, 15, {
      duration: 1,
    });
  }, [position, map]);

  return null;
};

// =====================================================
// PLACE ORDER
// =====================================================

const Placeorder = () => {
  const {
    backendURL,
    navigate,
    accessToken,
    cartItems,
    getCartAmount,
    setCartItems,
    delivery_fee,
    products,
  } = useShopContext();

  // ===================================================
  // PAYMENT METHOD
  // ===================================================

  const [method, setMethod] = useState("cod");

  // ===================================================
  // DELIVERY FORM
  // ===================================================

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // ===================================================
  // LOCATION
  // ===================================================

  const [location, setLocation] = useState(null);

  const [locationLoading, setLocationLoading] = useState(false);

  // This prevents address -> map geocoding when
  // the address was populated programmatically.
  const skipForwardGeocoding = useRef(false);

  // ===================================================
  // FORM CHANGE
  // ===================================================

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  // ===================================================
  // REVERSE GEOCODING
  //
  // latitude + longitude
  //          ↓
  // address
  // ===================================================

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/reverse",
        {
          params: {
            lat: latitude,
            lon: longitude,
            format: "jsonv2",
            addressdetails: 1,
            zoom: 18,
          },

          headers: {
            Accept: "application/json",
          },
        }
      );

      console.log("Reverse geocoding response:", response.data);

      const address = response.data.address || {};

      // -------------------------------
      // Street
      // -------------------------------

      const street =
        address.road ||
        address.street ||
        address.pedestrian ||
        address.residential ||
        address.footway ||
        address.path ||
        address.neighbourhood ||
        "";

      // -------------------------------
      // City
      // -------------------------------

      const city =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.suburb ||
        "";

      // -------------------------------
      // State
      // -------------------------------

      const state = address.state || address.state_district || "";

      // -------------------------------
      // Pin code
      // -------------------------------

      const zipcode = address.postcode || "";

      // -------------------------------
      // Country
      // -------------------------------

      const country = address.country || "";

      // -------------------------------
      // House number + street
      // -------------------------------

      const streetAddress = [address.house_number, street]
        .filter(Boolean)
        .join(", ");

      // IMPORTANT:
      // We are changing formData programmatically.
      // Don't immediately run forward geocoding.
      skipForwardGeocoding.current = true;

      setFormData((prev) => ({
        ...prev,

        street: streetAddress,

        city,

        state,

        zipcode,

        country,
      }));
    } catch (error) {
      console.error("Reverse geocoding failed:", error);

      toast.error("Could not fetch address");
    }
  };

  // ===================================================
  // GET CURRENT LOCATION
  // ===================================================

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");

      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const newPosition = [latitude, longitude];

        setLocation(newPosition);

        await getAddressFromCoordinates(latitude, longitude);

        setLocationLoading(false);

        toast.success("Location detected successfully");
      },

      (error) => {
        console.error("Geolocation error:", error);

        setLocationLoading(false);

        toast.error(
          "Unable to get your location. Please allow location access."
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // ===================================================
  // FORWARD GEOCODING
  //
  // address
  //    ↓
  // latitude + longitude
  // ===================================================

  const getCoordinatesFromAddress = async () => {
    const { street, city, state, zipcode, country } = formData;

    const address = [street, city, state, zipcode, country]
      .filter(Boolean)
      .join(", ");

    if (address.trim().length < 5) {
      return;
    }

    try {
      console.log("Searching address:", address);

      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: address,
            format: "jsonv2",
            limit: 1,
            addressdetails: 1,
          },

          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.data || response.data.length === 0) {
        console.log("Address not found:", address);

        return;
      }

      const result = response.data[0];

      const latitude = Number(result.lat);

      const longitude = Number(result.lon);

      console.log("Forward geocoding result:", result);

      setLocation([latitude, longitude]);
    } catch (error) {
      console.error("Forward geocoding failed:", error);
    }
  };

  // ===================================================
  // ADDRESS -> MAP
  //
  // Wait 1 second after user stops typing
  // ===================================================

  useEffect(() => {
    // Skip when formData was populated automatically
    if (skipForwardGeocoding.current) {
      skipForwardGeocoding.current = false;

      return;
    }

    const timer = setTimeout(() => {
      getCoordinatesFromAddress();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [
    formData.street,
    formData.city,
    formData.state,
    formData.zipcode,
    formData.country,
  ]);

  // ===================================================
  // LOAD SAVED USER LOCATION
  // ===================================================

  const loadSavedLocation = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/user/location`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

        withCredentials: true,
      });

      if (response.data.success && response.data.data.location) {
        const savedLocation = response.data.data.location;

        // -------------------------------------------
        // Set map position
        // -------------------------------------------

        if (
          savedLocation.latitude !== undefined &&
          savedLocation.longitude !== undefined
        ) {
          setLocation([savedLocation.latitude, savedLocation.longitude]);
        }

        // -------------------------------------------
        // Restore address fields
        // -------------------------------------------

        if (savedLocation.address) {
          // Don't forward geocode these values
          skipForwardGeocoding.current = true;

          setFormData((prev) => ({
            ...prev,

            street: savedLocation.address.street || "",

            city: savedLocation.address.city || "",

            state: savedLocation.address.state || "",

            zipcode: savedLocation.address.zipcode || "",

            country: savedLocation.address.country || "",
          }));
        }
      }
    } catch (error) {
      console.error("Could not load saved location:", error);
    }
  };

  // ===================================================
  // LOAD SAVED LOCATION WHEN PAGE OPENS
  // ===================================================

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    loadSavedLocation();
  }, [accessToken]);

  // ===================================================
  // SAVE USER LOCATION
  // ===================================================

  const saveUserLocation = async () => {
    if (!location) {
      return;
    }

    try {
      await axios.put(
        `${backendURL}/api/user/location`,

        {
          latitude: location[0],

          longitude: location[1],

          address: {
            street: formData.street,

            city: formData.city,

            state: formData.state,

            zipcode: formData.zipcode,

            country: formData.country,
          },
        },

        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },

          withCredentials: true,
        }
      );

      console.log("User location saved successfully");
    } catch (error) {
      console.error("Failed to save user location:", error);
    }
  };

  // ===================================================
  // RAZORPAY PAYMENT
  // ===================================================

  const initPayment = (response) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,

      amount: response.data.data.amount,

      currency: response.data.data.currency,

      order_id: response.data.data.id,

      name: "Order Payment",

      description: "Order Payment",

      receipt: response.data.data.receipt,

      handler: async (paymentResponse) => {
        try {
          const verifyResponse = await axios.post(
            `${backendURL}/api/order/verifyRazorpay`,

            paymentResponse,

            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (verifyResponse.data.success) {
            toast.success("Payment Successful");

            setCartItems({});

            navigate("/orders");
          } else {
            toast.error("Payment Verification Failed");

            navigate("/cart");
          }
        } catch (error) {
          console.error(error);

          toast.error(
            error.response?.data?.message || "Payment Verification Failed"
          );
        }
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.open();
  };

  // ===================================================
  // SUBMIT ORDER
  // ===================================================

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // -----------------------------------------------
    // Check login
    // -----------------------------------------------

    if (!accessToken) {
      toast.error("Please login first");

      navigate("/login");

      return;
    }

    // -----------------------------------------------
    // Check location
    // -----------------------------------------------

    if (!location) {
      toast.error("Please select your delivery location");

      return;
    }

    // -----------------------------------------------
    // Save location
    // -----------------------------------------------

    await saveUserLocation();

    try {
      // ---------------------------------------------
      // Create order items
      // ---------------------------------------------

      let orderItem = [];

      for (const items in cartItems) {
        for (const size in cartItems[items]) {
          if (cartItems[items][size] > 0) {
            const itemInfo = structuredClone(
              products.find((prod) => prod._id === items)
            );

            if (itemInfo) {
              itemInfo.size = size;

              itemInfo.quantity = cartItems[items][size];

              orderItem.push(itemInfo);
            }
          }
        }
      }

      // ---------------------------------------------
      // Order data
      // ---------------------------------------------

      const orderData = {
        address: formData,

        items: orderItem,

        amount: getCartAmount() + delivery_fee,
      };

      // ---------------------------------------------
      // COD
      // ---------------------------------------------

      if (method === "cod") {
        const response = await axios.post(
          `${backendURL}/api/order/place`,

          orderData,

          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data.success) {
          setCartItems({});

          navigate("/orders");
        } else {
          toast.error("Something went Wrong");
        }
      }

      // ---------------------------------------------
      // STRIPE
      // ---------------------------------------------

      if (method === "stripe") {
        const response = await axios.post(
          `${backendURL}/api/order/stripe`,

          orderData,

          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data.success) {
          const session_url = response.data.data.session_url;

          window.location.replace(session_url);
        } else {
          toast.error("Something went Wrong");
        }
      }

      // ---------------------------------------------
      // RAZORPAY
      // ---------------------------------------------

      if (method === "razorpay") {
        const response = await axios.post(
          `${backendURL}/api/order/razorpay`,

          orderData,

          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data.success) {
          console.log(response);

          initPayment(response);
        } else {
          toast.error("Something went Wrong");
        }
      }
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Something went Wrong");
    }
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <form
      onSubmit={onSubmitHandler}
      className="
        flex
        flex-col
        sm:flex-row
        justify-between
        gap-4
        pt-5
        sm:pt-14
        min-h-[60vh]
        border-t
      "
    >
      {/* =================================================
          DELIVERY INFORMATION
          ================================================= */}

      <div
        className="
          flex
          flex-col
          gap-4
          w-full
          sm:max-w-120
        "
      >
        <div
          className="
            text-xl
            sm:text-2xl
            my-3
          "
        >
          <Title text1="DELIVERY" text2="INFORMATION" />
        </div>

        {/* First Name / Last Name */}

        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            required
            type="text"
            placeholder="First name"
            className="
              border
              border-gray-300
              rounded
              py-2
              px-4
              w-full
            "
          />

          <input
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            required
            type="text"
            placeholder="Last name"
            className="
              border
              border-gray-300
              rounded
              py-2
              px-4
              w-full
            "
          />
        </div>

        {/* Email */}

        <input
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          required
          type="email"
          placeholder="Email address"
          className="
            border
            border-gray-300
            rounded
            py-2
            px-4
            w-full
          "
        />

        {/* Current location */}

        <button
          type="button"
          onClick={getCurrentLocation}
          className="
            w-full
            border
            border-gray-300
            rounded
            py-3
            px-4
            text-left
            hover:border-black
            transition-all
          "
        >
          📍{" "}
          {locationLoading
            ? "Getting your location..."
            : "Use my current location"}
        </button>

        {/* MAP */}

        {location && (
          <div
            className="
              w-full
              h-[300px]
              rounded
              overflow-hidden
              border
              border-gray-300
            "
          >
            <MapContainer
              center={location}
              zoom={15}
              scrollWheelZoom={true}
              className="
                h-full
                w-full
              "
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapUpdater position={location} />

              <LocationMarker
                position={location}
                setPosition={setLocation}
                getAddressFromCoordinates={getAddressFromCoordinates}
              />
            </MapContainer>
          </div>
        )}

        {/* Coordinates */}

        {location && (
          <div
            className="
              text-xs
              text-gray-500
              -mt-2
            "
          >
            <p>Latitude: {location[0].toFixed(6)}</p>

            <p>Longitude: {location[1].toFixed(6)}</p>

            <p className="mt-1">
              Click the map to change your delivery location.
            </p>
          </div>
        )}

        {/* Street */}

        <input
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          required
          type="text"
          placeholder="Street / House No."
          className="
            border
            border-gray-300
            rounded
            py-2
            px-4
            w-full
          "
        />

        {/* City / State */}

        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            required
            type="text"
            placeholder="City"
            className="
              border
              border-gray-300
              rounded
              py-2
              px-4
              w-full
            "
          />

          <input
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            required
            type="text"
            placeholder="State"
            className="
              border
              border-gray-300
              rounded
              py-2
              px-4
              w-full
            "
          />
        </div>

        {/* Pin / Country */}

        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            required
            type="text"
            placeholder="Pin Code"
            className="
              border
              border-gray-300
              rounded
              py-2
              px-4
              w-full
            "
          />

          <input
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            required
            type="text"
            placeholder="Country"
            className="
              border
              border-gray-300
              rounded
              py-2
              px-4
              w-full
            "
          />
        </div>

        {/* Phone */}

        <input
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          required
          type="tel"
          placeholder="Contact Number"
          className="
            border
            border-gray-300
            rounded
            py-2
            px-4
            w-full
          "
        />
      </div>

      {/* =================================================
          RIGHT SIDE
          ================================================= */}

      <div className="mt-8">
        <div
          className="
            mt-8
            min-w-80
            sm:min-w-120
          "
        >
          <CartTotal />
        </div>

        {/* PAYMENT */}

        <div className="mt-12">
          <Title text1="PAYMENT" text2="METHOD" />

          <div
            className="
              flex
              flex-col
              lg:flex-row
              gap-3
            "
          >
            {/* STRIPE */}

            <div
              onClick={() => setMethod("stripe")}
              className={`
                flex
                items-center
                gap-3
                p-3
                px-4
                cursor-pointer
                rounded-lg
                border
                transition-all
                duration-300
                ease-in-out
                hover:scale-105
                hover:shadow-lg
                hover:border-green-500
                hover:bg-green-50

                ${
                  method === "stripe"
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-300"
                }
              `}
            >
              <div
                className={`
                  w-4
                  h-4
                  rounded-full
                  border-2
                  flex
                  items-center
                  justify-center

                  ${
                    method === "stripe" ? "border-green-500" : "border-gray-400"
                  }
                `}
              >
                {method === "stripe" && (
                  <div
                    className="
                      w-2
                      h-2
                      rounded-full
                      bg-green-500
                    "
                  />
                )}
              </div>

              <img src={assets.stripe_logo} alt="Stripe" className="h-5 mx-4" />
            </div>

            {/* RAZORPAY */}

            <div
              onClick={() => setMethod("razorpay")}
              className={`
                flex
                items-center
                gap-3
                p-3
                px-4
                cursor-pointer
                rounded-lg
                border
                transition-all
                duration-300
                ease-in-out
                hover:scale-105
                hover:shadow-lg
                hover:border-green-500
                hover:bg-green-50

                ${
                  method === "razorpay"
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-300"
                }
              `}
            >
              <div
                className={`
                  w-4
                  h-4
                  rounded-full
                  border-2
                  flex
                  items-center
                  justify-center

                  ${
                    method === "razorpay"
                      ? "border-green-500"
                      : "border-gray-400"
                  }
                `}
              >
                {method === "razorpay" && (
                  <div
                    className="
                      w-2
                      h-2
                      rounded-full
                      bg-green-500
                    "
                  />
                )}
              </div>

              <img
                src={assets.razorpay_logo}
                alt="Razorpay"
                className="h-5 mx-4"
              />
            </div>

            {/* COD */}

            <div
              onClick={() => setMethod("cod")}
              className={`
                flex
                items-center
                gap-3
                p-3
                px-4
                cursor-pointer
                rounded-lg
                border
                transition-all
                duration-300
                ease-in-out
                hover:scale-105
                hover:shadow-lg
                hover:border-green-500
                hover:bg-green-50

                ${
                  method === "cod"
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-300"
                }
              `}
            >
              <div
                className={`
                  w-4
                  h-4
                  rounded-full
                  border-2
                  flex
                  items-center
                  justify-center

                  ${method === "cod" ? "border-green-500" : "border-gray-400"}
                `}
              >
                {method === "cod" && (
                  <div
                    className="
                      w-2
                      h-2
                      rounded-full
                      bg-green-500
                    "
                  />
                )}
              </div>

              <p
                className="
                  text-gray-700
                  text-sm
                  font-semibold
                  mx-4
                  whitespace-nowrap
                "
              >
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          {/* PLACE ORDER */}

          <div
            className="
              w-full
              text-end
              mt-8
            "
          >
            <button
              type="submit"
              className="
                bg-black
                text-white
                px-16
                py-3
                text-sm
                cursor-pointer
              "
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Placeorder;
