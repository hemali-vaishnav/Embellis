import React, { useEffect, useState } from "react";
import LogoAnimation from "../LogoAnimation";
import { FiUser, FiSearch } from "react-icons/fi";
import { Link } from "react-router";
import { GrFavorite } from "react-icons/gr";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(1); // 🔥 change dynamically later

  const CartIcon = ({ className }) => (
    <svg
      viewBox="0 0 21 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M16.0995 20H4.89828C3.65924 20 2.58102 19.1502 2.28655 17.9403L0.0734934 8.8974C-0.11678 8.09085 0.0666979 7.24101 0.574094 6.58711C1.08375 5.93549 1.8607 5.55044 2.68522 5.54589H5.79755C5.31054 -1.85205 15.6895 -1.84521 15.2002 5.54589C16.3758 5.54589 17.4427 5.54589 18.3126 5.54589C19.1371 5.55272 19.914 5.93549 20.4237 6.58939C20.9333 7.24101 21.1168 8.09313 20.9265 8.89968L18.7135 17.9403C18.419 19.1502 17.3408 20.0023 16.1018 20H16.0995ZM2.68522 6.96988C2.29335 6.97216 1.92639 7.15443 1.68402 7.46201C1.44391 7.77187 1.35557 8.17287 1.44618 8.55564L3.65924 17.5963C3.79741 18.1704 4.30934 18.5737 4.89602 18.5714H16.0972C16.6839 18.5714 17.1958 18.1682 17.334 17.5963L19.5471 8.55564C19.6377 8.17287 19.5493 7.7696 19.3092 7.46201C19.0669 7.15215 18.6999 6.96988 18.3103 6.9676C16.1788 6.9676 12.8671 6.9676 9.66871 6.9676H2.68522V6.96988ZM7.21327 5.54589C9.28137 5.54589 11.7708 5.54589 13.7845 5.54589C14.2851 0.027626 6.71041 0.0299044 7.21327 5.54589Z" />
    </svg>
  );

  const actionLinks = [
    { icon: FiUser, to: "#", label: "Account" },
    { icon: CartIcon, to: "/cart", label: "Cart", isCart: true },
    { icon: GrFavorite, to: "/favorite", label: "Favorite" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Men",
      path: "/collections/men",

    },
    {
      name: "Women",
      path: "/collections/women",

    },

    // 🔥 NEW
    {
      name: "Handcrafted",
      path: "#",
      categories: ["Men", "Women"],
    },

    {
      name: "Custom",
      path: "/custom",
    },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Background */}
      <div
        className={`absolute top-0 left-0 w-full h-full bg-[#fffaf0] shadow-sm transform transition-all duration-500 ease-in-out 
        ${scrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
      />

      <div className="relative mx-auto h-[125px] px-14  grid grid-cols-[1fr_auto_1fr] items-center py-2">

        {/* Left Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-wider uppercase">
          {navLinks.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className="relative flex items-center gap-1 text-[#3d2b1a] group py-2"
            >
              {item.name}
              {item.categories && (
                <div className="absolute top-full left-0 hidden group-hover:block pt-2 ">
                  <div className="bg-white shadow-lg p-4 w-[240px]">
                    {item.categories.map((cat, index) => (
                      <p key={index} className="text-sm hover:underline cursor-pointer">
                        {cat}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Dropdown Arrow */}
              {item.name === "Handcrafted" ? (
                <MdKeyboardArrowDown className="w-5 h-5 transition-transform duration-500 group-hover:rotate-180" />
              ) : (
                ""
              )}

              {/* Underline */}
              <span className="absolute left-[-2px] bottom-1 w-0 h-[1px] bg-black transition-all duration-500 ease-out group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Logo */}
        <div className="flex justify-center items-center">
          <Link to="/">
            <LogoAnimation />
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex justify-end items-center gap-6">

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 border border-[#3d2b1a]/15 bg-white/70 backdrop-blur-sm w-full max-w-[250px]">
            <FiSearch className="w-6 h-6 text-[#3d2b1a]/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products"
              className="w-full bg-transparent text-sm text-[#3d2b1a] placeholder:text-[#3d2b1a]/55 focus:outline-none"
            />
          </div>

          {/* Icons */}
          {actionLinks.map(({ icon: Icon, to, label, isCart }, i) => (
            <Link
              key={i}
              to={to}
              aria-label={label}
              className="relative group cursor-pointer"
            >
              <Icon className="w-6 h-6" />

              {/* Cart Badge */}
              {isCart && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] 
                min-w-[16px] h-[16px] px-[4px] flex items-center justify-center 
                rounded-full">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
} 