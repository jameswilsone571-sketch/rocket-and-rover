type LogoProps = {
  tone?: "light" | "dark";
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
};

function RocketMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="14" cy="50" r="6" fill="#52D6C5" />
      <ellipse
        cx="14"
        cy="50"
        rx="10"
        ry="3"
        fill="none"
        stroke="#FFD45C"
        strokeWidth="1.6"
        transform="rotate(-18 14 50)"
      />
      <g transform="rotate(-18 38 30)">
        <path
          d="M38 8 C44 14 46 22 46 30 L30 30 C30 22 32 14 38 8 Z"
          fill="#FFFFFF"
          stroke="#14234B"
          strokeWidth="1.4"
        />
        <circle cx="38" cy="21" r="4" fill="#48B8E8" stroke="#14234B" strokeWidth="1.2" />
        <path d="M30 26 L23 36 L30 34 Z" fill="#FFB8CF" />
        <path d="M46 26 L53 36 L46 34 Z" fill="#FFB8CF" />
        <rect x="30" y="30" width="16" height="3" rx="1.5" fill="#7654C7" />
        <path d="M34 34 C35 41 41 41 42 34 C40 37.5 36 37.5 34 34 Z" fill="#FFD45C" />
      </g>
      <path d="M54 8 L55.2 11.8 L59 13 L55.2 14.2 L54 18 L52.8 14.2 L49 13 L52.8 11.8 Z" fill="#FFD45C" />
      <circle cx="8" cy="14" r="1.8" fill="#52D6C5" />
      <circle cx="56" cy="34" r="1.5" fill="#A5C8FF" />
    </svg>
  );
}

export function Logo({ tone = "dark", showTagline = false, size = "md" }: LogoProps) {
  const mainText = tone === "light" ? "text-white" : "text-navy";
  const markSize = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-8 w-8" : "h-11 w-11";
  const word =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-[1.4rem] leading-none";

  return (
    <span className="inline-flex items-center gap-2.5">
      <RocketMark className={markSize} />
      <span className="flex flex-col">
        <span className={`font-display font-semibold tracking-tight ${word} ${mainText}`}>
          Rocket <span className="text-star">{"&"}</span> Rover
        </span>
        {showTagline && (
          <span
            className={`mt-0.5 text-[0.58rem] font-extrabold uppercase tracking-[0.22em] ${
              tone === "light" ? "text-lav/70" : "text-cosmic"
            }`}
          >
            Creative space adventures
          </span>
        )}
      </span>
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-2xl bg-navy ${className ?? "h-10 w-10"}`}>
      <RocketMark className="h-[78%] w-[78%]" />
    </span>
  );
}
