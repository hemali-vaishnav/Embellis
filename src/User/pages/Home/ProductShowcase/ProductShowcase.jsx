import React, { useMemo, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../../redux/slices/cartSlice";
import { toggleFavorite } from "../../../../redux/slices/favoriteSlice";
import { openAuthModal } from "../../../../redux/slices/authModalSlice";

const isLoggedIn = () => Boolean(localStorage.getItem("token"));

export default function ProductShowcase({ title, products = [] }) {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.favorites);
  const [justAdded, setJustAdded] = useState(null);

  const likedIds = useMemo(
    () => new Set(favorites.map((fav) => fav.product?._id).filter(Boolean)),
    [favorites]
  );

  if (!products.length) return null;

  const handleToggleFavorite = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn()) {
      dispatch(openAuthModal());
      return;
    }
    dispatch(toggleFavorite(product._id));
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn()) {
      dispatch(openAuthModal());
      return;
    }
    const firstSize = product.size?.split(",")[0]?.trim();
    dispatch(addToCart({ productId: product._id, quantity: 1, size: firstSize }));
    setJustAdded(product._id);
    setTimeout(() => setJustAdded((current) => (current === product._id ? null : current)), 1500);
  };

  return (
    <section className="bg-[#f5f5f5] py-10 px-6">
      {title && (
        <h2 className="text-xl font-semibold uppercase tracking-wider mb-6 px-2">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link to={`/product/${product._id}`} key={product._id} className="group block">

            {/* Image Card */}
            <div className="relative bg-white overflow-hidden">

              {/* Wishlist */}
              <FiHeart
                onClick={(e) => handleToggleFavorite(e, product)}
                className={`absolute top-3 right-3 text-lg cursor-pointer transition
                  ${likedIds.has(product._id) ? "text-red-600 fill-red-600 opacity-100" : "opacity-70 hover:opacity-100"}`}
                fill={likedIds.has(product._id) ? "currentColor" : "none"}
              />

              {/* Product Image */}
              {product.image_1 ? (
                <>
                  <img
                    src={product.image_1}
                    alt={product.product_name}
                    className="w-full h-[400px] object-cover"
                  />
                  {product.image_2 && (
                    <img
                      src={product.image_2}
                      alt={product.product_name}
                      className="absolute inset-0 w-full h-[400px] object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  )}
                </>
              ) : (
                <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 text-gray-300 text-6xl font-semibold uppercase">
                  {product.product_name?.[0] || "?"}
                </div>
              )}

              {/* Add to Cart (Hover) */}
              <button
                onClick={(e) => handleAddToCart(e, product)}
                className="absolute bottom-0 left-0 w-full bg-black text-white text-sm py-3
                translate-y-full group-hover:translate-y-0 transition-all duration-300"
              >
                {justAdded === product._id ? "ADDED ✓" : "ADD TO CART"}
              </button>
            </div>

            {/* Product Info */}
            <div className="mt-3">
              <h3 className="text-sm font-medium uppercase">
                {product.product_name}
              </h3>

              <div className="flex items-center gap-2 mt-1 text-sm">
                <span className="text-black font-medium">
                  Rs.{product.price}
                </span>
                {product.size && (
                  <span className="text-gray-400">| {product.size}</span>
                )}
              </div>
            </div>

          </Link>
        ))}

      </div>
    </section>
  );
}
