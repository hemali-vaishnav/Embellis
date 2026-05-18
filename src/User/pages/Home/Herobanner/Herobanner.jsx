import React from "react";

export default function Herobanner() {
  const image = "../assets/herobanner.png"
  return (
    <section className="relative w-full h-screen overflow-hidden">

      <img
        src={image}
        alt="Hero"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/10" />
    </section>
  );
}