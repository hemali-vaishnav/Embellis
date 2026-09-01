import React, { useLayoutEffect, useRef, useState } from 'react'

export default function SubCategoryTabs({ options, active, onChange }) {
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
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex]);

  return (
    <div className="flex justify-center px-6">
      <div className="relative inline-flex gap-4">
        {options.map((opt, i) => (
          <button
            key={opt.label}
            ref={(el) => (tabRefs.current[i] = el)}
            onClick={() => onChange(opt.value)}
            className={`pb-4 text-[13px] tracking-[0.18em] uppercase whitespace-nowrap transition-colors duration-300
              ${active === opt.value
                ? 'text-[#3d2b1a] font-semibold'
                : 'text-[#3d2b1a]/35 font-medium hover:text-[#3d2b1a]/70'}`}
          >
            {opt.label}
          </button>
        ))}
        <span
          className="absolute bottom-0 h-[2px] bg-[#3d2b1a] transition-all duration-300 ease-out"
          style={{ left: indicator.left, width: indicator.width }}
        />
      </div>
    </div>
  )
}
