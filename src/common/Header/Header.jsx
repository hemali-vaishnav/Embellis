import React, { useEffect, useState } from "react";
import LogoAnimation from "../LogoAnimation";
import { FiShoppingCart, FiUser, FiSearch } from "react-icons/fi";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      
      {/* Background layer (animated) */}
      <div
        className={`absolute top-0 left-0 w-full h-full bg-[#fbf7ef] shadow-sm transform transition-all duration-500 ease-in-out 
        ${scrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
      ></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <div className="flex items-center">
          <LogoAnimation />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-800">
          <a href="/" className="hover:text-black transition">Home</a>
          <a href="/shop" className="hover:text-black transition">Shop</a>
          <a href="/custom" className="hover:text-black transition">Custom Embroidery</a>
          <a href="/bulk" className="hover:text-black transition">Bulk Orders</a>
          <a href="/about" className="hover:text-black transition">About</a>
          <a href="/contact" className="hover:text-black transition">Contact</a>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          <FiSearch className="w-6 h-6 cursor-pointer text-gray-700 hover:text-black" />
          <FiUser className="w-6 h-6 cursor-pointer text-gray-700 hover:text-black" />
          <FiShoppingCart className="w-6 h-6 cursor-pointer text-gray-700 hover:text-black" />
        </div>

      </div>
    </header>
  );
}