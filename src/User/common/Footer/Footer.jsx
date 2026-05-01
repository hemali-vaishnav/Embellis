import React from "react";
import { FiSend } from "react-icons/fi";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white text-[#3d2b1a] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-10 py-16 grid md:grid-cols-3 gap-10">

        {/* Newsletter */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
            Newsletter
          </h3>
          <p className="text-sm text-[#3d2b1a]/70 mb-6 leading-relaxed">
            Join Embellis and be the first to explore our latest modern
            embroidery collections and exclusive handcrafted pieces.
          </p>

          <div className="flex items-center border-b border-[#3d2b1a]/40 pb-2">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full bg-transparent outline-none text-sm placeholder:text-[#3d2b1a]/50"
            />
            <FiSend className="ml-3 text-lg cursor-pointer hover:translate-x-1 transition" />
          </div>

          {/* Social */}
          <div className="flex gap-5 mt-6 text-lg">
            <FaFacebookF className="cursor-pointer hover:opacity-70" />
            <FaInstagram className="cursor-pointer hover:opacity-70" />
          </div>
        </div>

        {/* About */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
            About Embellis
          </h3>
          <ul className="space-y-3 text-sm text-[#3d2b1a]/70">
            <li className="hover:text-black cursor-pointer">About Us</li>
            <li className="hover:text-black cursor-pointer">Contact Us</li>
            <li className="hover:text-black cursor-pointer">Careers</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
            Company
          </h3>
          <ul className="space-y-3 text-sm text-[#3d2b1a]/70">
            <li className="hover:text-black cursor-pointer">
              Terms & Conditions
            </li>
            <li className="hover:text-black cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-black cursor-pointer">
              Return & Exchange
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-6 px-10 flex flex-col md:flex-row items-center justify-between text-sm text-[#3d2b1a]/60">
        <p>
          © {new Date().getFullYear()} Embellis — Modern Embroidery Clothing
        </p>

        {/* Payment Icons */}
        <div className="flex gap-6 mt-4 md:mt-0 opacity-70">
          <span>Mastercard</span>
          <span>VISA</span>
          <span>PayPal</span>
        </div>
      </div>
    </footer>
  );
}