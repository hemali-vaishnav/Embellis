import React from "react";
import { FiHeart } from "react-icons/fi";

const products = [
  {
    id: 1,
    name: "Dragline Track Pants",
    price: 1499,
    oldPrice: 1899,
    discount: 21,
    image: "https://via.placeholder.com/400x500",
  },
  {
    id: 2,
    name: "Overdrive 08 Oversized T-Shirt",
    price: 1099,
    oldPrice: 1299,
    discount: 15,
    image: "https://via.placeholder.com/400x500",
  },
  {
    id: 3,
    name: "Overdrive 08 Oversized T-Shirt",
    price: 1099,
    oldPrice: 1299,
    discount: 15,
    image: "https://via.placeholder.com/400x500",
  },
  {
    id: 4,
    name: "Supersonic 07 Oversized T-Shirt",
    price: 999,
    oldPrice: 1299,
    discount: 23,
    image: "https://via.placeholder.com/400x500",
  },
];

export default function ProductShowcase() {
  return (
    <section className="bg-[#f5f5f5] py-10 px-6">
      <div className="grid grid-cols-4 gap-6">
        
        {products.map((product) => (
          <div key={product.id} className="group">

            {/* Image Card */}
            <div className="relative bg-white overflow-hidden">

              {/* Discount Badge */}
              <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                SAVE {product.discount}%
              </span>

              {/* Wishlist */}
              <FiHeart className="absolute top-3 right-3 text-lg cursor-pointer opacity-70 hover:opacity-100" />

              {/* Product Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[400px] object-cover"
              />

              {/* Add to Cart (Hover) */}
              <button className="absolute bottom-0 left-0 w-full bg-black text-white text-sm py-3 
              translate-y-full group-hover:translate-y-0 transition-all duration-300">
                ADD TO CART
              </button>
            </div>

            {/* Product Info */}
            <div className="mt-3">
              <h3 className="text-sm font-medium uppercase">
                {product.name}
              </h3>

              <div className="flex items-center gap-2 mt-1 text-sm">
                <span className="text-gray-400 line-through">
                  Rs.{product.oldPrice}
                </span>
                <span className="text-red-600 font-medium">
                  Rs.{product.price}
                </span>
              </div>
            </div>

          </div>
        ))}

      </div>
    </section>
  );
}