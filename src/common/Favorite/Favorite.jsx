import React from "react";

export default function Favorite() {
  return (
    <section className="min-h-screen bg-[#fbf7ef] px-6 pt-32 pb-16">
      <div className="mx-auto max-w-5xl rounded-[28px] border border-[#3d2b1a]/10 bg-white/80 p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-[#8a5a35]">Favorites</p>
        <h1 className="mt-3 text-4xl font-semibold text-[#2f241b]">Your favorite page</h1>
        <p className="mt-4 max-w-2xl text-[#5c4634]">
          This is a placeholder favorite page. You can now click the favorite icon
          in the header and it will open here.
        </p>
      </div>
    </section>
  );
}
