import React, { useEffect } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { FiHeart } from "react-icons/fi";
import { fetchFavorites, toggleFavorite } from "../../../redux/slices/favoriteSlice";
import { addToCart } from "../../../redux/slices/cartSlice";
import { openAuthModal } from "../../../redux/slices/authModalSlice";

const isLoggedIn = () => Boolean(localStorage.getItem("token"));

export default function Favorite() {
  const dispatch = useDispatch();
  const { favorites, loading, error } = useSelector((state) => state.favorites);
  const loggedIn = isLoggedIn();

  useEffect(() => {
    if (loggedIn) dispatch(fetchFavorites());
  }, [dispatch, loggedIn]);

  return (
    <section className="min-h-screen bg-[#fbf7ef] px-6 pt-32 pb-16">
      <div className="mx-auto max-w-5xl rounded-[28px] border border-[#3d2b1a]/10 bg-white/80 p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-[#8a5a35]">Favorites</p>
        <h1 className="mt-3 text-4xl font-semibold text-[#2f241b]">Your Favorites</h1>

        {!loggedIn && (
          <div className="mt-6">
            <p className="text-[#5c4634]">Please login to view your favorites.</p>
            <button
              onClick={() => dispatch(openAuthModal())}
              className="mt-4 bg-black text-white text-sm px-6 py-2.5 rounded-xl"
            >
              Login / Sign up
            </button>
          </div>
        )}

        {loggedIn && error && <p className="mt-6 text-sm text-red-500">{error}</p>}

        {loggedIn && loading && favorites.length === 0 && (
          <p className="mt-6 text-[#5c4634]">Loading your favorites...</p>
        )}

        {loggedIn && !loading && favorites.length === 0 && !error && (
          <p className="mt-6 text-[#5c4634]">
            You haven't liked anything yet. Tap the heart on a product to save it here.
          </p>
        )}

        {loggedIn && favorites.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6">
            {favorites.map((fav) => {
              const product = fav.product;
              if (!product) return null;

              return (
                <Link to={`/product/${product._id}`} key={fav._id} className="group block">
                  <div className="relative bg-white overflow-hidden rounded-2xl">
                    <FiHeart
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dispatch(toggleFavorite(product._id));
                      }}
                      className="absolute top-3 right-3 text-lg cursor-pointer text-red-600"
                      fill="currentColor"
                    />

                    {product.image_1 ? (
                      <img
                        src={product.image_1}
                        alt={product.product_name}
                        className="w-full h-[320px] object-cover"
                      />
                    ) : (
                      <div className="w-full h-[320px] flex items-center justify-center bg-gray-100 text-gray-300 text-5xl font-semibold uppercase">
                        {product.product_name?.[0] || "?"}
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dispatch(addToCart({ productId: product._id, quantity: 1 }));
                      }}
                      className="absolute bottom-0 left-0 w-full bg-black text-white text-sm py-3
                      translate-y-full group-hover:translate-y-0 transition-all duration-300"
                    >
                      ADD TO CART
                    </button>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-sm font-medium uppercase">{product.product_name}</h3>
                    <p className="text-sm text-[#8a5a35] mt-1">Rs.{product.price}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
