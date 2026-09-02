import React from "react";
import { FiTruck, FiFeather, FiShield, FiRefreshCw } from "react-icons/fi";

const BADGES = [
  {
    icon: <FiTruck className="text-lg" />,
    title: "Free Shipping",
    desc: "On all orders above Rs.999",
  },
  {
    icon: <FiFeather className="text-lg" />,
    title: "Handcrafted Quality",
    desc: "Every piece made with care",
  },
  {
    icon: <FiShield className="text-lg" />,
    title: "Secure Payments",
    desc: "100% protected checkout",
  },
  {
    icon: <FiRefreshCw className="text-lg" />,
    title: "Easy Returns",
    desc: "7-day hassle-free returns",
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-white border-y border-[#3d2b1a]/10 py-10 px-6">
      <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-8">
        {BADGES.map((badge) => (
          <div key={badge.title} className="flex items-center gap-3.5">
            <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-full bg-[#3d2b1a] text-white">
              {badge.icon}
            </span>
            <div>
              <p className="text-sm font-semibold text-[#2f241b]">{badge.title}</p>
              <p className="text-xs text-[#3d2b1a]/60 mt-0.5">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
