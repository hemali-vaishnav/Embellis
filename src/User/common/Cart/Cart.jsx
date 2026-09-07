import React, { useEffect } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { fetchCart, updateCartItem, removeFromCart, clearCart } from "../../../redux/slices/cartSlice";
import { openAuthModal } from "../../../redux/slices/authModalSlice";
import { useIsLoggedIn } from "../../../commonfunction/useAuthState";

export default function Cart() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);
  const loggedIn = useIsLoggedIn();

  useEffect(() => {
    if (loggedIn) dispatch(fetchCart());
  }, [dispatch, loggedIn]);

  const total = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <section className="min-h-screen bg-[#fbf7ef] px-6 pt-32 pb-16">
      <div className="mx-auto max-w-5xl rounded-[28px] border border-[#3d2b1a]/10 bg-white/80 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#8a5a35]">Cart</p>
            <h1 className="mt-3 text-4xl font-semibold text-[#2f241b]">Your Cart</h1>
          </div>
          {loggedIn && items.length > 0 && (
            <button
              onClick={() => dispatch(clearCart())}
              className="text-sm text-[#8a5a35] hover:underline"
            >
              Clear cart
            </button>
          )}
        </div>

        {!loggedIn && (
          <div className="mt-6">
            <p className="text-[#5c4634]">Please login to view your cart.</p>
            <button
              onClick={() => dispatch(openAuthModal())}
              className="mt-4 bg-black text-white text-sm px-6 py-2.5 rounded-xl"
            >
              Login / Sign up
            </button>
          </div>
        )}

        {loggedIn && error && <p className="mt-6 text-sm text-red-500">{error}</p>}

        {loggedIn && loading && items.length === 0 && (
          <p className="mt-6 text-[#5c4634]">Loading your cart...</p>
        )}

        {loggedIn && !loading && items.length === 0 && !error && (
          <p className="mt-6 text-[#5c4634]">Your cart is empty. Go add something you like.</p>
        )}

        {loggedIn && items.length > 0 && (
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 rounded-2xl border border-[#3d2b1a]/10 bg-white p-4"
              >
                <Link
                  to={`/product/${item.product?._id}`}
                  className="flex flex-1 items-center gap-4 min-w-0"
                >
                  <div className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center text-gray-300 text-2xl font-semibold uppercase">
                    {item.product?.image_1 ? (
                      <img
                        src={item.product.image_1}
                        alt={item.product.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      item.product?.product_name?.[0] || "?"
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#2f241b] hover:underline">{item.product?.product_name}</h3>
                    <p className="text-sm text-[#8a5a35]">
                      {item.size && <>Size: {item.size} · </>}Rs.{item.product?.price}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      item.quantity > 1
                        ? dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity - 1 }))
                        : dispatch(removeFromCart(item._id))
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-[#3d2b1a]/20 hover:border-[#3d2b1a]"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity + 1 }))}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-[#3d2b1a]/20 hover:border-[#3d2b1a]"
                    aria-label="Increase quantity"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>

                <p className="w-20 text-right font-medium text-[#2f241b]">
                  Rs.{(item.product?.price || 0) * item.quantity}
                </p>

                <button
                  onClick={() => dispatch(removeFromCart(item._id))}
                  className="text-[#8a5a35] hover:text-red-600"
                  aria-label="Remove item"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}

            <div className="flex items-center justify-between border-t border-[#3d2b1a]/10 pt-6">
              <span className="text-lg font-medium text-[#2f241b]">Total</span>
              <span className="text-2xl font-semibold text-[#2f241b]">Rs.{total}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
