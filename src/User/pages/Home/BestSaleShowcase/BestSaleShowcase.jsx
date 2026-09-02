import React, { useMemo, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../../redux/slices/cartSlice";
import { toggleFavorite } from "../../../../redux/slices/favoriteSlice";
import { openAuthModal } from "../../../../redux/slices/authModalSlice";

const isLoggedIn = () => Boolean(localStorage.getItem("token"));

export default function BestSaleShowcase({ title = "Best Sale", products = [] }) {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.favorites);
  const [justAdded, setJustAdded] = useState(null);

  const likedIds = useMemo(
    () => new Set(favorites.map((fav) => fav.product?._id).filter(Boolean)),
    [favorites]
  );

  const featured = products.slice(0, 4);
  if (!featured.length) return null;

  const handleToggleFavorite = (product) => {
    if (!isLoggedIn()) {
      dispatch(openAuthModal());
      return;
    }
    dispatch(toggleFavorite(product._id));
  };

  const handleAddToCart = (product) => {
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
      <div className="flex items-center justify-center mb-14">
        <h2 className="text-2xl font-semibold text-[#2f241b]">{title}</h2>
      </div>

      <div className="mx-auto max-w-6xl space-y-24">
        {featured.map((product, index) => {
          const sizeOptions = product.size
            ? product.size.split(",").map((s) => s.trim()).filter(Boolean)
            : [];
          const images = [product.image_1, product.image_2].filter(Boolean);
          const imageOnRight = index % 2 === 1;

          return (
            <div key={product._id} className="grid md:grid-cols-2 gap-10 items-start">
              {/* Image gallery — scroll to change image */}
              <div className={`relative ${imageOnRight ? "md:order-2" : "md:order-1"}`}>
                <FiHeart
                  onClick={() => handleToggleFavorite(product)}
                  className={`absolute top-4 right-4 z-10 text-xl cursor-pointer drop-shadow transition
                    ${likedIds.has(product._id) ? "text-red-600" : "text-white opacity-90 hover:opacity-100"}`}
                  fill={likedIds.has(product._id) ? "currentColor" : "none"}
                />
                {images.length > 0 ? (
                  <div
                    className="h-[800px] overflow-y-auto snap-y snap-mandatory [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={product.product_name}
                        className="w-full h-[800px] object-cover snap-start"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-[800px] flex items-center justify-center bg-gray-100 text-gray-300 text-6xl font-semibold uppercase">
                    {product.product_name?.[0] || "?"}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className={`pt-2 md:pt-10 ${imageOnRight ? "md:order-1" : "md:order-2"}`}>
                <p className="text-xs uppercase tracking-[0.25em] text-[#3d2b1a]/50">
                  {product.category}
                  {product.sub_category && ` / ${product.sub_category}`}
                </p>
                <h3 className="text-2xl font-semibold text-[#2f241b] mt-2">
                  {product.product_name}
                </h3>
                <p className="text-lg text-[#3d2b1a] mt-2">Rs.{product.price}</p>

                <div className="mt-8 border-t border-[#3d2b1a]/10">
                  {sizeOptions.length > 0 && (
                    <div className="flex items-center justify-between py-4 border-b border-[#3d2b1a]/10 text-xs uppercase tracking-[0.2em] text-[#8a5a35]">
                      <span>Available Sizes</span>
                      <span className="text-[#3d2b1a]/70 normal-case tracking-normal">
                        {sizeOptions.join(" / ")}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-4 border-b border-[#3d2b1a]/10 text-xs uppercase tracking-[0.2em] text-[#8a5a35]">
                    <span>Availability</span>
                    <span className="text-[#3d2b1a]/70 normal-case tracking-normal">
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  {product.type && (
                    <div className="flex items-center justify-between py-4 border-b border-[#3d2b1a]/10 text-xs uppercase tracking-[0.2em] text-[#8a5a35]">
                      <span>Fabric / Type</span>
                      <span className="text-[#3d2b1a]/70 normal-case tracking-normal">
                        {product.type}
                      </span>
                    </div>
                  )}
                  <Link
                    to={`/product/${product._id}`}
                    className="block py-4 border-b border-[#3d2b1a]/10 text-xs uppercase tracking-[0.2em] text-[#8a5a35] hover:text-[#3d2b1a]"
                  >
                    View Full Details
                  </Link>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                  className="mt-8 w-full sm:w-auto bg-[#3d2b1a] text-white text-xs font-semibold uppercase tracking-wider px-10 py-3.5 disabled:opacity-40"
                >
                  {justAdded === product._id ? "ADDED ✓" : "ADD TO CART"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
