import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { FiGrid, FiBox, FiUsers, FiShoppingCart, FiScissors, FiLogOut, FiShoppingBag } from "react-icons/fi";
import { baseUrl } from "../../utils/url";
import { resetCart } from "../redux/slices/cartSlice";
import { resetFavorites } from "../redux/slices/favoriteSlice";
import { notifyAuthChange } from "../commonfunction/useAuthState";
import { getAuthItem, clearAuthData } from "../commonfunction/authStorage";

const navItems = [
  { to: "/admin/catalog", label: "Catalog", icon: <FiGrid /> },
  { to: "/admin/products", label: "Products", icon: <FiBox /> },
  { to: "/admin/users", label: "Users", icon: <FiUsers /> },
  { to: "/admin/cart-wishlist", label: "Cart & Wishlist", icon: <FiShoppingCart /> },
  { to: "/admin/custom-orders", label: "Custom Orders", icon: <FiScissors /> },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const token = getAuthItem("token");

    try {
      if (token) {
        await fetch(`${baseUrl}/users/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // Still log the user out locally even if the request fails.
    } finally {
      clearAuthData();
      notifyAuthChange();
      dispatch(resetCart());
      dispatch(resetFavorites());
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-[#3d2b1a] flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r flex flex-col">
        <Link to="/admin/catalog" className="px-6 py-5 text-lg font-semibold tracking-tight border-b">
          Embellis Admin
        </Link>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                ${isActive ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"}`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 space-y-1 border-t">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            <FiShoppingBag />
            View Store
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-8 py-10 max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
}
