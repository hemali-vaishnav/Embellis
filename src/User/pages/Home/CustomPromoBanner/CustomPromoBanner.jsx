import React from "react";
import { Link } from "react-router";

export default function CustomPromoBanner() {
  return (
    <section className="bg-[#3d2b1a] text-white py-16 px-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">Make It Yours</p>
      <h2 className="text-3xl md:text-4xl font-semibold mb-4">Design Your Own Product</h2>
      <p className="text-white/70 max-w-xl mx-auto mb-8">
        Pick a garment, upload your design, and we'll bring it to life — fully custom, made for you.
      </p>
      <Link
        to="/custom"
        className="inline-block bg-white text-[#3d2b1a] px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-wider hover:bg-white/90 transition"
      >
        Start Customizing
      </Link>
    </section>
  );
}
