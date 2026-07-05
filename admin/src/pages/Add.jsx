import React, { useState } from "react";
import { useOutletContext } from "react-router";
import { assets } from "../assets/admin_assets/assets.js";
import { backendUrl } from "../App.jsx";
import axios from "axios";
import { toast } from "react-toastify";
// import { products } from "../../../frontend/src/assets/assets.js"
const Add = () => {
  const { token } = useOutletContext();
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setdescription] = useState("");
  const [price, setPrice] = useState("");

  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const onsubmitHandler = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Uploading product...");
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      // const response = await axios.post(`${backendUrl}/api/product/add`, formData
      //   ,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        toast.update(toastId, {
          render: "Product uploaded successfully",
          type: "success",
          isLoading: false,
          autoClose: 1500,
          pauseOnHover: false,
        });
      }
    } catch (error) {
      console.log(error);
      console.log(error.response);

      toast.update(toastId, {
        render: error.response?.data?.message || "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 1500,
        pauseOnHover: false,
      });
    }
    setName("");
    setdescription("");
    setImage1(false);
    setImage2(false);
    setImage3(false);
    setImage4(false);
    setPrice("");
    setSizes([]);
    setCategory("Men");
    setSubCategory("Topwear");
    setBestseller(false);
  };
  const urlToFile = async (url, filename) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  };

  //
  // const addDummyProducts = async (e) => {
  //   e.preventDefault();
  //   try {
  //     for (const product of products) {
  //       const formData = new FormData();

  //       formData.append("name", product.name);
  //       formData.append("description", product.description);
  //       formData.append("price", product.price*4);
  //       formData.append("category", product.category);
  //       formData.append("subCategory", product.subCategory);
  //       formData.append("bestseller", product.bestseller);
  //       formData.append("sizes", JSON.stringify(product.sizes));

  //       for (let i = 0; i < product.image.length; i++) {
  //         const file = await urlToFile(product.image[i], `image${i}.png`);
  //         formData.append(`image${i + 1}`, file);
  //       }

  //       await axios.post(`${backendUrl}/api/product/add`, formData, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //     }

  //     toast.success("Dummy products added successfully!");
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.response?.data?.message || "Something went wrong");
  //   }
  // }
  return (
    <div className="w-full px-4 md:px-8 py-6">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Add Product</h1>
        <p className="text-sm text-gray-500 mt-1">
          Add a new product to your store.
        </p>
      </div>

      <form
        onSubmit={onsubmitHandler}
        className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-6 max-w-5xl"
      >
        {/* Upload Images */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            Upload Images
          </p>

          <div className="flex flex-wrap gap-4">
            {[
              { image: image1, setImage: setImage1, id: "image1" },
              { image: image2, setImage: setImage2, id: "image2" },
              { image: image3, setImage: setImage3, id: "image3" },
              { image: image4, setImage: setImage4, id: "image4" },
            ].map((item) => (
              <label key={item.id} htmlFor={item.id} className="cursor-pointer">
                <img
                  src={
                    !item.image
                      ? assets.upload_area
                      : URL.createObjectURL(item.image)
                  }
                  className="w-24 h-24 rounded-lg border border-gray-200 object-cover hover:border-gray-400 transition"
                  alt=""
                />

                <input
                  hidden
                  id={item.id}
                  type="file"
                  onChange={(e) => item.setImage(e.target.files[0])}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Enter product name"
            required
            className="w-full max-w-xl rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setdescription(e.target.value)}
            rows={5}
            required
            placeholder="Write product description..."
            className="w-full max-w-xl rounded-lg border border-gray-300 px-4 py-3 outline-none resize-none focus:border-black"
          />
        </div>

        {/* Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-black"
            >
              <option>Men</option>
              <option>Women</option>
              <option>Kids</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub Category
            </label>

            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-black"
            >
              <option>Topwear</option>
              <option>Bottomwear</option>
              <option>Winterwear</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 ">
              Price
            </label>

            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              placeholder="100"
              className="w-full rounded-lg border border-gray-300 no-spinner px-4 py-3 outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Sizes */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            Available Sizes
          </p>

          <div className="flex flex-wrap gap-3">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes(size)
                      ? prev.filter((item) => item !== size)
                      : [...prev, size]
                  )
                }
                className={`rounded-lg border px-4 py-2 transition ${
                  sizes.includes(size)
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Bestseller */}
        <div className="flex items-center gap-3">
          <input
            id="bestseller"
            checked={bestseller}
            onChange={() => setBestseller((prev) => !prev)}
            type="checkbox"
            className="h-4 w-4"
          />

          <label
            htmlFor="bestseller"
            className="cursor-pointer text-sm text-gray-700"
          >
            Add to Bestseller
          </label>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-fit rounded-lg bg-black px-8 py-3 text-white font-medium hover:bg-gray-800 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Add;
