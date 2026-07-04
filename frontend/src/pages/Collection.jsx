import React, { useEffect, useState } from "react";
import useShopContext from "../context/ShopContext.jsx";
import { assets } from "../assets/assets.js";
import { ProductItem, Title } from "../components/index.js";

const Collection = () => {
  const { products,search,showSearch } = useShopContext();
  const [showFilter, setshowFilter] = useState(true);
  const [filterProducts, setfilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [SubCategory, setSubCategory] = useState([]);
  const [SortItem, setSortItem] = useState("relevant");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };
  const toggleSubCategory = (e) => {
    if (SubCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  useEffect(() => {
    let productscopy = products.slice();
    if(showSearch && search){
      productscopy = productscopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }
    // let filtered = productscopy;
    if (!(category.length === 0 && SubCategory.length === 0)) {
       productscopy = productscopy.filter((product) => {
        const categoryMatch =
          category.length === 0 || category.includes(product.category);

        const subCategoryMatch =
          SubCategory.length === 0 || SubCategory.includes(product.subCategory);

        return categoryMatch && subCategoryMatch;
      });

    }
    if (SortItem === "low-high") {
      productscopy.sort((a, b) => a.price - b.price);
    } else if (SortItem === "high-low") {
      productscopy.sort((a, b) => b.price - a.price);
    }
    setfilterProducts(productscopy);
  }, [category, SubCategory, products,SortItem,showSearch,search]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:gap-2 pt-10 border-t">
        {/* Left Side */}
        <div className=" sticky top-0 self-start bg-white pr-5 w-full sm:max-w-60">
          <div
            onClick={() => {
              if (window.innerWidth < 640) {
                setshowFilter((prev) => !prev);
              }
            }}
            className="text-2xl my-2 cursor-pointer sm:cursor-auto flex gap-2 "
          >
            FILTERS
            <img
              src={assets.dropdown_icon}
              alt=""
              className={`ml-2 mt-1.5 h-5 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            />
          </div>
          {/* Collection -> Male,female,kids  */}
          <div
            className={`border border-gray-300 pl-5 py-3 ${showFilter ? "" : "hidden"}`}
          >
            <div className="text-sm mb-2 font-medium">CATEGORIES</div>
            <div className="flex flex-col gap-2 text-sm  text-gray-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  value="Men"
                  className="w-4 h-4 cursor-pointer accent-[#d991b8]"
                  onChange={toggleCategory}
                />
                <span>Men</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  value="Women"
                  className="w-4 h-4 cursor-pointer accent-[#d991b8]"
                  onChange={toggleCategory}
                />
                <span>Women</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  value="Kids"
                  className="w-4 h-4 cursor-pointer accent-[#d991b8]"
                  onChange={toggleCategory}
                />
                <span>Kids</span>
              </label>
            </div>
          </div>

          <div
            className={`my-5 border border-gray-300 pl-5 py-3 ${showFilter ? "" : "hidden"}`}
          >
            <div className="text-sm mb-2 font-medium">TYPE</div>
            <div className="flex flex-col gap-2 text-sm font-medium text-gray-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  value="Topwear"
                  className="w-4 h-4 cursor-pointer accent-[#d991b8]"
                  onChange={toggleSubCategory}
                />
                <span>Topwear</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  value="Bottomwear"
                  className="w-4 h-4 cursor-pointer accent-[#d991b8]"
                  onChange={toggleSubCategory}
                />
                <span>Bottomwear</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  value="Winterwear"
                  className="w-4 h-4 cursor-pointer accent-[#d991b8]"
                  onChange={toggleSubCategory}
                />
                <span>Winterwear</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right SIde */}
        <div className="flex-1">
          <div className="flex justify-between text-base sm:text-2xl mb-4">
            <Title text1={"All"} text2={"COLLECTIONS"} />
            {/* Product Sort */}
            <select
              className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white cursor-pointer focus:outline-none focus:border-[#d991b8] focus:ring-1 focus:ring-[#d991b8]"
              onChange={(e) => setSortItem(e.target.value)}
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Collection;
