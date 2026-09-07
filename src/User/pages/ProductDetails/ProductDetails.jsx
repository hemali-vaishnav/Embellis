import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { FiHeart, FiChevronLeft, FiMinus, FiPlus } from "react-icons/fi";
import { fetchProductById, clearSelectedProduct, fetchProducts } from "../../../redux/slices/productSlice";
import { addToCart } from "../../../redux/slices/cartSlice";
import { fetchFavorites, toggleFavorite } from "../../../redux/slices/favoriteSlice";
import { openAuthModal } from "../../../redux/slices/authModalSlice";
import { useIsLoggedIn } from "../../../commonfunction/useAuthState";
import TrustBadges from "../Home/TrustBadges/TrustBadges";
import ProductShowcase from "../Home/ProductShowcase/ProductShowcase";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, selectedLoading: loading, selectedError: error, categories } = useSelector(
    (state) => state.products
  );
  const { favorites } = useSelector((state) => state.favorites);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const loggedIn = useIsLoggedIn();

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearSelectedProduct());
  }, [dispatch, id]);

  useEffect(() => {
    if (loggedIn) dispatch(fetchFavorites());
  }, [dispatch, loggedIn]);

  useEffect(() => {
    setActiveImage(0);
    setSelectedSize(product?.size?.split(",")[0]?.trim() || "");
    setQuantity(1);
  }, [product]);

  useEffect(() => {
    if (product?.category) dispatch(fetchProducts({ category: product.category }));
  }, [dispatch, product?.category]);

  const images = useMemo(
    () => [product?.image_1, product?.image_2].filter(Boolean),
    [product]
  );

  const sizeOptions = useMemo(
    () => (product?.size ? product.size.split(",").map((s) => s.trim()).filter(Boolean) : []),
    [product]
  );

  const isLiked = useMemo(
    () => favorites.some((fav) => fav.product?._id === product?._id),
    [favorites, product]
  );

  const relatedProducts = useMemo(
    () => (categories[0]?.products || []).filter((p) => p._id !== product?._id).slice(0, 4),
    [categories, product]
  );

  const handleToggleFavorite = () => {
    if (!loggedIn) {
      dispatch(openAuthModal());
      return;
    }
    dispatch(toggleFavorite(product._id));
  };

  const handleAddToCart = () => {
    if (!loggedIn) {
      dispatch(openAuthModal());
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity, size: selectedSize }));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-[#fbf7ef] px-6 pt-32 pb-16">
        <p className="text-center text-sm text-[#8a5a35]">Loading product...</p>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="min-h-screen bg-[#fbf7ef] px-6 pt-32 pb-16">
        <p className="text-center text-sm text-red-500">{error || "Product not found."}</p>
      </section>
    );
  }

  return (
    <div className="bg-[#fbf7ef]">
      <section className="px-6 pt-32 pb-16">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-[#8a5a35] hover:text-[#3d2b1a] mb-8 transition"
          >
            <FiChevronLeft />
            Back
          </Link>

          <div className="grid md:grid-cols-2 gap-14">
            {/* Images */}
            <div>
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm group">
                {images.length > 0 ? (
                  <img
                    src={images[activeImage]}
                    alt={product.product_name}
                    className="w-full h-140 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-140 flex items-center justify-center bg-[#f5f1e8] text-[#3d2b1a]/15 text-8xl font-semibold uppercase">
                    {product.product_name?.[0] || "?"}
                  </div>
                )}

                {(product.is_trending || product.is_best_seller) && (
                  <span className="absolute top-4 left-4 bg-[#3d2b1a] text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                    {product.is_best_seller ? "Best Seller" : "Trending"}
                  </span>
                )}

                <button
                  onClick={handleToggleFavorite}
                  aria-label="Toggle favorite"
                  className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-105"
                >
                  <FiHeart
                    className={isLiked ? "text-red-600" : "text-[#3d2b1a]"}
                    fill={isLiked ? "currentColor" : "none"}
                  />
                </button>
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 mt-4">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                        activeImage === i
                          ? "border-[#3d2b1a]"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="md:pt-2">
              <p className="text-xs uppercase tracking-[0.25em] text-[#3d2b1a]/50">
                {product.category}
                {product.sub_category && ` / ${product.sub_category}`}
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold text-[#2f241b] mt-3">
                {product.product_name}
              </h1>
              <p className="text-2xl text-[#3d2b1a] mt-3">Rs.{product.price}</p>

              {product.description && (
                <p className="text-[#5c4634] mt-4 leading-relaxed">{product.description}</p>
              )}

              {sizeOptions.length > 0 && (
                <div className="mt-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8a5a35] mb-3">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border text-sm transition ${
                          selectedSize === size
                            ? "bg-[#3d2b1a] text-white border-[#3d2b1a]"
                            : "border-[#3d2b1a]/20 text-[#3d2b1a] hover:border-[#3d2b1a]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8a5a35] mb-3">Quantity</p>
                <div className="inline-flex items-center gap-4 rounded-lg border border-[#3d2b1a]/20 px-3 py-1.5">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-7 h-7 flex items-center justify-center rounded-full text-[#3d2b1a] hover:bg-[#3d2b1a]/5 disabled:opacity-30"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="w-5 text-center text-sm font-medium text-[#2f241b]">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || q + 1, q + 1))}
                    disabled={product.stock > 0 && quantity >= product.stock}
                    aria-label="Increase quantity"
                    className="w-7 h-7 flex items-center justify-center rounded-full text-[#3d2b1a] hover:bg-[#3d2b1a]/5 disabled:opacity-30"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-8 border-t border-[#3d2b1a]/10">
                <div className="flex items-center justify-between py-4 border-b border-[#3d2b1a]/10 text-xs uppercase tracking-[0.2em] text-[#8a5a35]">
                  <span>Availability</span>
                  <span
                    className={`normal-case tracking-normal ${
                      product.stock > 0 ? "text-[#3d2b1a]/70" : "text-red-600"
                    }`}
                  >
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>
                {product.type && (
                  <div className="flex items-center justify-between py-4 border-b border-[#3d2b1a]/10 text-xs uppercase tracking-[0.2em] text-[#8a5a35]">
                    <span>Fabric / Type</span>
                    <span className="text-[#3d2b1a]/70 normal-case tracking-normal">{product.type}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 bg-[#3d2b1a] text-white py-3.5 rounded-xl text-sm font-semibold uppercase tracking-wider hover:bg-[#2f2115] transition disabled:opacity-40"
                >
                  {justAdded ? "Added to Cart ✓" : "Add to Cart"}
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className="w-14 h-14 flex items-center justify-center rounded-xl border border-[#3d2b1a]/20 hover:border-[#3d2b1a] transition"
                  aria-label="Toggle favorite"
                >
                  <FiHeart
                    className={isLiked ? "text-red-600" : "text-[#3d2b1a]"}
                    fill={isLiked ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustBadges />

      {relatedProducts.length > 0 && (
        <ProductShowcase title="You May Also Like" products={relatedProducts} />
      )}
    </div>
  );
}
