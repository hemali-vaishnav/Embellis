import React from "react";

export default function Herobanner() {
  const image =
    "https://i.pinimg.com/1200x/08/08/e1/0808e1fb7ee460268f8e885c1af1fbba.jpg";

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