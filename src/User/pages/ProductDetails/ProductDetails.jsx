import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { FiHeart, FiChevronLeft } from "react-icons/fi";
import { fetchProductById, clearSelectedProduct } from "../../../redux/slices/productSlice";
import { addToCart } from "../../../redux/slices/cartSlice";
import { fetchFavorites, toggleFavorite } from "../../../redux/slices/favoriteSlice";
import { openAuthModal } from "../../../redux/slices/authModalSlice";

const isLoggedIn = () => Boolean(localStorage.getItem("token"));

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, selectedLoading: loading, selectedError: error } = useSelector(
    (state) => state.products
  );
  const { favorites } = useSelector((state) => state.favorites);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [justAdded, setJustAdded] = useState(false);
  const loggedIn = isLoggedIn();

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
  }, [product]);

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

  const handleToggleFavorite = () => {
    if (!isLoggedIn()) {
      dispatch(openAuthModal());
      return;
    }
    dispatch(toggleFavorite(product._id));
  };

  const handleAddToCart = () => {
    if (!isLoggedIn()) {
      dispatch(openAuthModal());
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1, size: selectedSize }));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center text-sm text-gray-400">Loading product...</div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-32 pb-20 text-center text-sm text-red-500">
        {error || "Product not found."}
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-6 max-w-6xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-8">
        <FiChevronLeft />
        Back
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative bg-gray-100 rounded-2xl overflow-hidden">
            {images.length > 0 ? (
              <img
                src={images[activeImage]}
                alt={product.product_name}
                className="w-full h-[520px] object-cover"
              />
            ) : (
              <div className="w-full h-[520px] flex items-center justify-center text-gray-300 text-8xl font-semibold uppercase">
                {product.product_name?.[0] || "?"}
              </div>
            )}

            <FiHeart
              onClick={handleToggleFavorite}
              className={`absolute top-4 right-4 text-2xl cursor-pointer transition ${
                isLiked ? "text-red-600" : "text-white drop-shadow"
              }`}
              fill={isLiked ? "currentColor" : "none"}
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${
                    activeImage === i ? "border-black" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400">
            {product.category}
            {product.sub_category && ` / ${product.sub_category}`}
          </p>
          <h1 className="text-3xl font-semibold mt-2">{product.product_name}</h1>
          <p className="text-2xl font-medium mt-4">Rs.{product.price}</p>

          {product.description && (
            <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>
          )}

          {sizeOptions.length > 0 && (
            <div className="mt-8">
              <p className="text-sm font-medium mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border text-sm transition ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "border-gray-300 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500 mt-6">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 bg-black text-white py-3.5 rounded-xl text-sm font-medium disabled:opacity-40"
            >
              {justAdded ? "ADDED TO CART ✓" : "ADD TO CART"}
            </button>
            <button
              onClick={handleToggleFavorite}
              className="w-14 h-14 flex items-center justify-center rounded-xl border border-gray-300 hover:border-black"
              aria-label="Toggle favorite"
            >
              <FiHeart className={isLiked ? "text-red-600" : ""} fill={isLiked ? "currentColor" : "none"} />
            </button>
          </div>

          {product.type && (
            <p className="text-sm text-gray-500 mt-6">Fabric / Type: {product.type}</p>
          )}
        </div>
      </div>
    </div>
  );
}
