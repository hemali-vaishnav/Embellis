import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiHeart, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../../redux/slices/cartSlice";
import { toggleFavorite } from "../../../../redux/slices/favoriteSlice";
import { openAuthModal } from "../../../../redux/slices/authModalSlice";

const isLoggedIn = () => Boolean(localStorage.getItem("token"));
const AUTO_SLIDE_INTERVAL = 3500;
const CARD_GAP = 20;

export default function TrendingCarousel({ title = "Trending Collection", products = [] }) {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.favorites);
  const [justAdded, setJustAdded] = useState(null);
  const trackRef = useRef(null);
  const isPausedRef = useRef(false);

  const likedIds = useMemo(
    () => new Set(favorites.map((fav) => fav.product?._id).filter(Boolean)),
    [favorites]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track || products.length < 2) return;

    const intervalId = setInterval(() => {
      if (isPausedRef.current) return;
      const firstCard = track.firstElementChild;
      if (!firstCard) return;

      const step = firstCard.getBoundingClientRect().width + CARD_GAP;
      const maxScroll = track.scrollWidth - track.clientWidth;

      if (track.scrollLeft + step >= maxScroll - 1) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: step, behavior: "smooth" });
      }
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [products.length]);

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
    <section className="bg-[#fffaf0] py-14 px-6">
      <div className="flex items-center gap-2.5 mb-8">
        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#3d2b1a] text-white">
          <FiTrendingUp className="text-base" />
        </span>
        <h2 className="text-2xl font-semibold text-[#2f241b]">{title}</h2>
      </div>

      <div
        ref={trackRef}
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((product, index) => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            className="group block flex-shrink-0 snap-start w-[78%] sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
          >
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-300">

              {/* Rank badge */}
              <span className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#3d2b1a] shadow">
                #{index + 1} TRENDING
              </span>

              {/* Wishlist */}
              <button
                onClick={(e) => handleToggleFavorite(e, product)}
                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow"
              >
                <FiHeart
                  className={likedIds.has(product._id) ? "text-red-600" : "text-[#3d2b1a]/70"}
                  fill={likedIds.has(product._id) ? "currentColor" : "none"}
                />
              </button>

              {/* Image */}
              <div className="relative w-full h-[360px] overflow-hidden">
                {product.image_1 ? (
                  <img
                    src={product.image_1}
                    alt={product.product_name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300 text-5xl font-semibold uppercase">
                    {product.product_name?.[0] || "?"}
                  </div>
                )}

                {/* Gradient overlay with name/price */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 pt-10">
                  <h3 className="text-white text-sm font-medium uppercase truncate">
                    {product.product_name}
                  </h3>
                  <p className="text-white/90 text-sm mt-0.5">Rs.{product.price}</p>
                </div>

                {/* Add to Cart (Hover) */}
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="absolute bottom-0 left-0 w-full bg-[#3d2b1a] text-white text-xs font-semibold uppercase tracking-wider py-3
                  translate-y-full group-hover:translate-y-0 transition-all duration-300"
                >
                  {justAdded === product._id ? "ADDED ✓" : "ADD TO CART"}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
