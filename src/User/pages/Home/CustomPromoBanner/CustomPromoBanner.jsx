import React from "react";
import { Link } from "react-router";

const INK = "#3d2b1a";
const ACCENT = "#c05a3c";

function DesignArt() {
  return (
    <svg viewBox="0 0 100 120" className="w-full h-full">
      <path
        d="M32 26 L42 14 L48 20 L52 20 L58 14 L68 26 L62 37 L57 32 L57 92 L43 92 L43 32 L38 37 Z"
        fill="none"
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M45 20 Q50 25 55 20" fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M45 48 L55 48 M44 58 L56 58 M45 68 L55 68 M44 78 L56 78"
        stroke={INK}
        strokeWidth="0.8"
        opacity="0.45"
      />
      <g transform="rotate(38 84 32)">
        <line x1="84" y1="4" x2="84" y2="55" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <polygon points="80,4 88,4 84,-6" fill={INK} />
        <line x1="80" y1="8" x2="88" y2="8" stroke="#fffaf0" strokeWidth="1" />
      </g>
    </svg>
  );
}

function StitchArt() {
  return (
    <svg viewBox="0 0 100 120" className="w-full h-full">
      <path
        d="M15 80 Q30 62 45 80 T75 80"
        fill="none"
        stroke={INK}
        strokeWidth="1.6"
        strokeDasharray="5 5"
        strokeLinecap="round"
      />
      <line x1="15" y1="92" x2="85" y2="92" stroke={INK} strokeWidth="1.2" opacity="0.5" />
      <line x1="15" y1="80" x2="15" y2="92" stroke={INK} strokeWidth="1.2" opacity="0.5" />
      <line x1="85" y1="80" x2="85" y2="92" stroke={INK} strokeWidth="1.2" opacity="0.5" />
      <g transform="rotate(28 62 40)">
        <line x1="62" y1="4" x2="62" y2="62" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
        <ellipse cx="62" cy="12" rx="4.5" ry="8" fill="none" stroke={INK} strokeWidth="1.8" />
        <path d="M62 62 Q48 70 42 85" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function PackArt() {
  return (
    <svg viewBox="0 0 100 120" className="w-full h-full">
      <path
        d="M20 40 L50 26 L80 40 L80 86 L50 100 L20 86 Z"
        fill="none"
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M20 40 L50 54 L80 40" fill="none" stroke={INK} strokeWidth="1.6" />
      <line x1="50" y1="54" x2="50" y2="100" stroke={INK} strokeWidth="1.6" />
      <line x1="50" y1="26" x2="50" y2="54" stroke={ACCENT} strokeWidth="2.4" />
      <path d="M20 86 L50 100 L80 86" fill="none" stroke={ACCENT} strokeWidth="2.4" />
      <path d="M40 22 Q50 10 60 22" fill="none" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M42 16 Q46 22 42 27 M58 16 Q54 22 58 27" fill="none" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const STEPS = [
  {
    art: <DesignArt />,
    title: "We Design It",
    desc: "Your idea, sketched to life",
    left: 50,
    top: 12,
    rotate: "-3deg",
  },
  {
    art: <StitchArt />,
    title: "We Stitch It",
    desc: "Handcrafted with care",
    left: 84,
    top: 80,
    rotate: "2deg",
  },
  {
    art: <PackArt />,
    title: "We Pack It",
    desc: "Sealed up & sent to you",
    left: 16,
    top: 80,
    rotate: "-2deg",
  },
];

export default function CustomPromoBanner() {
  return (
    <section className="bg-[#3d2b1a] text-white py-16 px-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">Make It Yours</p>
      <h2 className="text-3xl md:text-4xl font-semibold mb-4">Design Your Own Product</h2>
      <p className="text-white/70 max-w-xl mx-auto mb-4">
        Pick a garment, upload your design, and we'll bring it to life — fully custom, made for you.
      </p>

      {/* How we make it — a continuous loop */}
      <div className="relative max-w-md mx-auto h-[380px] sm:h-[420px] my-10">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <marker
              id="loopArrow"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.55)" />
            </marker>
          </defs>
          <path
            d="M50,14 Q92,34 84,78"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
            strokeDasharray="3 3"
            fill="none"
            markerEnd="url(#loopArrow)"
          />
          <path
            d="M84,80 Q50,98 16,80"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
            strokeDasharray="3 3"
            fill="none"
            markerEnd="url(#loopArrow)"
          />
          <path
            d="M16,78 Q8,34 50,14"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
            strokeDasharray="3 3"
            fill="none"
            markerEnd="url(#loopArrow)"
          />
        </svg>

        {STEPS.map((step) => (
          <div
            key={step.title}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-32 sm:w-36"
            style={{ left: `${step.left}%`, top: `${step.top}%` }}
          >
            <span
              className="flex items-center justify-center w-28 h-32 sm:w-32 sm:h-36 rounded-md bg-[#fffaf0] shadow-lg p-3"
              style={{ transform: `rotate(${step.rotate})` }}
            >
              {step.art}
            </span>
            <p className="text-sm font-semibold uppercase tracking-wide mt-3">{step.title}</p>
            <p className="text-xs text-white/60 mt-1">{step.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-white/50 text-xs uppercase tracking-[0.25em] mb-8">
        A cycle we repeat for every single order
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
