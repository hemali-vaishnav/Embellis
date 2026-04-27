import { useEffect, useState } from "react";

import base from "/assets/base-logo.png";
import embellis from "/assets/embellis.png";
import needle from "/assets/needle.png";
import flower from "/assets/flower.png";

export default function LogoAnimation() {
    const [showIntro, setShowIntro] = useState(false);
    const [showFlower, setShowFlower] = useState(false);

    useEffect(() => {
        const introTimer = setTimeout(() => setShowIntro(true), 200);
        const flowerTimer = setTimeout(() => setShowFlower(true), 1400);

        return () => {
            clearTimeout(introTimer);
            clearTimeout(flowerTimer);
        };
    }, []);

    return (
        <div className="relative w-[140px] h-[120px] isolate overflow-hidden">

            {/* 🔹 Needle (slower drop) */}
            <img
                src={needle}
                className={`absolute z-10 transition-all duration-[1200ms]
                left-[52%] -translate-x-1/2 h-[85%] w-auto
                ${showIntro ? "top-1.5 opacity-100" : "-top-40 opacity-0"}`}
                style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
            />

            {/* 🔹 Flower (delayed + smoother) */}
            <img
                src={flower}
                className={`absolute z-0 transition-all duration-[1300ms]
                left-[51%] top-[49%] -translate-x-1/2 -translate-y-1/2
                h-[80%] w-auto
                ${showFlower ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            />

            {/* 🔹 Embellis (smooth slide) */}
            <img
                src={embellis}
                className={`absolute z-20 transition-all duration-[1200ms]
                top-[48%] -translate-y-1/2 h-[100%] w-auto
                ${showIntro ? "left-[20%] opacity-100" : "-left-full opacity-0"}`}
                style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
            />

            {/* 🔹 Base */}
            <img
                src={base}
                className="absolute w-full h-full object-contain z-30"
            />
        </div>
    );
}