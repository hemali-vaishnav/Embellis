import React, { useEffect, useState } from "react";
import LogoAnimation from "../LogoAnimation";
import { FiShoppingCart, FiUser, FiSearch } from "react-icons/fi";
import { Link } from "react-router";
import { MdFavoriteBorder } from "react-icons/md";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const actionLinks = [
    { icon: FiUser, to: "#", label: "Account" },
    { icon: FiShoppingCart, to: "/cart", label: "Cart" },
    { icon: MdFavoriteBorder, to: "/favorite", label: "Favorite" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20); // softer trigger
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Home", "Men", "Women", "Custom"];

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Background Layer */}
      <div
        className={`absolute inset-0 backdrop-blur-md bg-[#fbf7ef]
        transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
        will-change-transform will-change-opacity
        ${scrolled
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-3"}`}
      />

      <div className="relative max-w-7xl mx-auto h-[120px] px-6 grid grid-cols-[1fr_auto_1fr] items-center pt-2">

        {/* Left Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-wider uppercase">
          {navLinks.map((item, i) => (
            <Link
              key={i}
              to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
              className="relative text-[#3d2b1a] transition duration-300 group"
            >
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-black 
              transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Logo */}
        <div className="flex justify-center items-center group cursor-pointer transition-transform duration-500 ease-out hover:scale-[1.03]">
          <Link to={"/"}>
            <LogoAnimation />
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex justify-end items-center gap-4">

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 border border-[#3d2b1a]/15 bg-white/70 backdrop-blur-sm w-full max-w-[220px] transition-all duration-300 focus-within:shadow-sm">
            <FiSearch className="w-4 h-4 text-[#3d2b1a]/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products"
              className="w-full bg-transparent text-sm text-[#3d2b1a] placeholder:text-[#3d2b1a]/55 focus:outline-none"
            />
          </div>

          {/* Icons */}
          {actionLinks.map(({ icon: Icon, to, label }, i) => (
            <Link
              key={i}
              to={to}
              aria-label={label}
              className="relative group cursor-pointer"
            >
              <Icon className="w-6 h-6 text-[#3d2b1a] transition-all duration-300 ease-out group-hover:scale-110" />

              {/* ripple hover */}
              <span className="absolute inset-0 rounded-full scale-0 bg-black/5 
              transition-transform duration-300 ease-out group-hover:scale-125"></span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}