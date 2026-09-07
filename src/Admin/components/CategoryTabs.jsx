import React, { useLayoutEffect, useRef, useState } from "react";

// Same underline-indicator tab pattern as the storefront's SubCategoryTabs,
// re-themed for the admin dashboard's neutral gray/black palette.
export default function CategoryTabs({ options, active, onChange }) {
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const tabRefs = useRef([]);
  const activeIndex = options.findIndex((opt) => opt.value === active);

  useLayoutEffect(() => {
    const activeTab = tabRefs.current[activeIndex];
    if (activeTab) {
      setIndicator({ left: activeTab.offsetLeft, width: activeTab.offsetWidth });
    }

    const handleResize = () => {
      const tab = tabRefs.current[activeIndex];
      if (tab) setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex]);

  return (
    <div className="relative inline-flex gap-10 border-b border-gray-200">
      {options.map((opt, i) => (
        <button
          key={opt.value}
          ref={(el) => (tabRefs.current[i] = el)}
          onClick={() => onChange(opt.value)}
          className={`pb-3 text-sm whitespace-nowrap transition-colors duration-200
            ${active === opt.value
              ? "text-black font-semibold"
              : "text-gray-400 font-medium hover:text-gray-600"}`}
        >
          {opt.label}
        </button>
      ))}
      <span
        className="absolute bottom-0 h-[2px] bg-black transition-all duration-200 ease-out"
        style={{ left: indicator.left, width: indicator.width }}
      />
    </div>
  );
}
