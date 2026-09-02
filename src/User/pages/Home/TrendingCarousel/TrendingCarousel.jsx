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
const DRAG_THRESHOLD = 5;

export default function TrendingCarousel({
  title = "Trending Collection",
  products = [],
  icon = <FiTrendingUp className="text-base" />,
}) {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.favorites);
  const [justAdded, setJustAdded] = useState(null);
  const trackRef = useRef(null);
  const isPausedRef = useRef(false);

  const isDraggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const scrollStartLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

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

  // Click-and-drag to slide (mouse only — touch already scrolls natively)
  const handlePointerDown = (e) => {
    if (e.pointerType !== "mouse" || !trackRef.current) return;
    isDraggingRef.current = true;
    dragMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    scrollStartLeftRef.current = trackRef.current.scrollLeft;
    isPausedRef.current = true;
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    const delta = e.clientX - dragStartXRef.current;
    if (Math.abs(delta) > DRAG_THRESHOLD) dragMovedRef.current = true;
    trackRef.current.scrollLeft = scrollStartLeftRef.current - delta;
  };

  const endDrag = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    isPausedRef.current = false;
    setIsDragging(false);
  };

  const handleCardClick = (e) => {
    if (dragMovedRef.current) {
      e.preventDefault();
      dragMovedRef.current = false;
    }
  };

  return (
    <section className="bg-[#fffaf0] py-14 px-6">
      <div className="flex items-center justify-center gap-2.5 mb-8">
        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#3d2b1a] text-white">
          {icon}
        </span>
        <h2 className="text-2xl font-semibold text-[#2f241b]">{title}</h2>
      </div>

      <div
        ref={trackRef}
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        className={`flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 select-none [&::-webkit-scrollbar]:hidden
          ${isDragging ? "cursor-grabbing scroll-auto" : "cursor-grab"}`}
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((product) => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            onClick={handleCardClick}
            onDragStart={(e) => e.preventDefault()}
            className="group block flex-shrink-0 snap-start w-[78%] sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
          >
            <div className="relative bg-white overflow-hidden">
              {/* Wishlist */}
              <FiHeart
                onClick={(e) => handleToggleFavorite(e, product)}
                className={`absolute top-3 right-3 z-10 text-lg cursor-pointer drop-shadow transition
                  ${likedIds.has(product._id) ? "text-red-600 opacity-100" : "text-[#3d2b1a] opacity-70 hover:opacity-100"}`}
                fill={likedIds.has(product._id) ? "currentColor" : "none"}
              />

              {/* Image */}
              <div className="relative w-full h-[800px] overflow-hidden pointer-events-none">
                {product.image_1 ? (
                  <img
                    src={product.image_1}
                    alt={product.product_name}
                    draggable={false}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300 text-5xl font-semibold uppercase">
                    {product.product_name?.[0] || "?"}
                  </div>
                )}
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

            {/* Product Info */}
            <div className="mt-3">
              <h3 className="text-sm font-medium uppercase text-[#2f241b] truncate">
                {product.product_name}
              </h3>
              <p className="text-[#3d2b1a]/80 text-sm mt-0.5">Rs.{product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
