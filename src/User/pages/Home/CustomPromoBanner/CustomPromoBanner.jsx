import { Link } from "react-router";

const ORBIT_DURATION = 18; // seconds for one full lap of the loop

const STEPS = [
  {
    photo: "/assets/process/design.jpg",
    title: "We Design It",
    desc: "Your idea, sketched to life",
    left: 50,
    top: 16,
  },
  {
    photo: "/assets/process/stitch.jpg",
    title: "We Stitch It",
    desc: "Handcrafted with care",
    left: 84,
    top: 76,
  },
  {
    photo: "/assets/process/pack.jpg",
    title: "We Pack It",
    desc: "Sealed up & sent to you",
    left: 16,
    top: 76,
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
      <div className="relative max-w-md mx-auto h-95 sm:h-105 my-10">
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
            d="M50,16 Q92,36 84,76"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
            strokeDasharray="3 3"
            fill="none"
            markerEnd="url(#loopArrow)"
          />
          <path
            d="M84,78 Q50,98 16,78"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
            strokeDasharray="3 3"
            fill="none"
            markerEnd="url(#loopArrow)"
          />
          <path
            d="M16,76 Q8,36 50,16"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
            strokeDasharray="3 3"
            fill="none"
            markerEnd="url(#loopArrow)"
          />
        </svg>

        {STEPS.map((step, i) => (
          <div
            key={step.title}
            className="promo-orbit-step absolute flex flex-col items-center w-32 sm:w-36"
            style={{
              "--static-left": `${step.left}%`,
              "--static-top": `${step.top}%`,
              animationDelay: `${-(i * ORBIT_DURATION) / 3}s`,
            }}
          >
            <span className="block w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-white/15 shadow-xl">
              <img src={step.photo} alt={step.title} className="w-full h-full object-cover" />
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

      <style>{`
        @keyframes promoOrbit {
          0%     { left: 50%; top: 16%; transform: translate(-50%, -50%) scale(1); }
          16.65% { left: 78%; top: 38%; transform: translate(-50%, -50%) scale(1.05); }
          33.3%  { left: 84%; top: 76%; transform: translate(-50%, -50%) scale(1); }
          50%    { left: 50%; top: 82%; transform: translate(-50%, -50%) scale(1.05); }
          66.7%  { left: 16%; top: 76%; transform: translate(-50%, -50%) scale(1); }
          83.35% { left: 22%; top: 38%; transform: translate(-50%, -50%) scale(1.05); }
          100%   { left: 50%; top: 16%; transform: translate(-50%, -50%) scale(1); }
        }
        .promo-orbit-step {
          left: var(--static-left);
          top: var(--static-top);
          transform: translate(-50%, -50%);
          animation: promoOrbit ${ORBIT_DURATION}s ease-in-out infinite;
        }
        .promo-orbit-step:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .promo-orbit-step {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
