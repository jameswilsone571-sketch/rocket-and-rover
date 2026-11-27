type StarFieldProps = {
  density?: number;
  className?: string;
  colors?: string[];
};

/** Decorative twinkling stars + drifting planets. Pure CSS, aria-hidden, respects reduced motion via global CSS. */
export function StarField({
  density = 24,
  className = "",
  colors = ["#FFFFFF", "#FFD45C", "#52D6C5", "#FFB8CF"],
}: StarFieldProps) {
  // Deterministic pseudo-random layout so SSR and client match
  const stars = Array.from({ length: density }, (_, i) => {
    const seed = (n: number) => {
      const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
      return x - Math.floor(x);
    };
    return {
      left: seed(1) * 100,
      top: seed(2) * 100,
      size: 2 + seed(3) * 4,
      delay: seed(4) * 3,
      duration: 2.4 + seed(5) * 2.6,
      color: colors[Math.floor(seed(6) * colors.length)],
      round: seed(7) > 0.5,
    };
  });

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {stars.map((s, i) =>
        s.round ? (
          <span
            key={i}
            className="absolute rounded-full animate-twinkle"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              background: s.color,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ) : (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className="absolute animate-twinkle"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size + 4,
              height: s.size + 4,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          >
            <path
              d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2Z"
              fill={s.color}
            />
          </svg>
        )
      )}
      <svg
        viewBox="0 0 80 40"
        className="absolute right-[6%] top-[12%] h-10 w-20 animate-float-slow opacity-70"
      >
        <circle cx="32" cy="22" r="11" fill="#52D6C5" opacity="0.9" />
        <ellipse cx="32" cy="22" rx="20" ry="5" fill="none" stroke="#FFD45C" strokeWidth="2" transform="rotate(-16 32 22)" />
      </svg>
      <svg
        viewBox="0 0 40 40"
        className="absolute left-[8%] bottom-[10%] h-8 w-8 animate-float opacity-70"
      >
        <circle cx="20" cy="20" r="13" fill="#FFB8CF" opacity="0.85" />
        <circle cx="15" cy="16" r="3" fill="#14234B" opacity="0.12" />
        <circle cx="24" cy="24" r="4" fill="#14234B" opacity="0.1" />
      </svg>
    </div>
  );
}
