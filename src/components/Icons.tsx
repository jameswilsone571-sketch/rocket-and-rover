type IconProps = { className?: string; strokeWidth?: number };

function base(
  path: React.ReactNode,
  { className = "h-5 w-5", strokeWidth = 2 }: IconProps = {},
  filled = false
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}

export const IconCart = (p: IconProps) =>
  base(
    <>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
      <path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.3h7.6a1.5 1.5 0 0 0 1.5-1.2L20 8H6" />
    </>,
    p
  );

export const IconSearch = (p: IconProps) =>
  base(
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>,
    p
  );

export const IconUser = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
    </>,
    p
  );

export const IconMenu = (p: IconProps) =>
  base(
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>,
    p
  );

export const IconX = (p: IconProps) =>
  base(
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </>,
    p
  );

export const IconHeart = (p: IconProps & { filled?: boolean }) =>
  base(
    <path d="M12 20.5C7 16.5 3.5 13.3 3.5 9.7 3.5 7 5.6 5 8.1 5c1.6 0 3 .8 3.9 2.1C12.9 5.8 14.3 5 15.9 5c2.5 0 4.6 2 4.6 4.7 0 3.6-3.5 6.8-8.5 10.8Z" />,
    p,
    p.filled
  );

export const IconEye = (p: IconProps) =>
  base(
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>,
    p
  );

export const IconStar = (p: IconProps & { filled?: boolean }) =>
  base(
    <path d="m12 3 2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3Z" />,
    p,
    p.filled
  );

export const IconChevronDown = (p: IconProps) => base(<path d="m6 9 6 6 6-6" />, p);
export const IconChevronRight = (p: IconProps) => base(<path d="m9 6 6 6-6 6" />, p);
export const IconArrowRight = (p: IconProps) =>
  base(
    <>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </>,
    p
  );

export const IconCheck = (p: IconProps) => base(<path d="m4.5 12.5 5 5 10-11" />, p);
export const IconTrash = (p: IconProps) =>
  base(
    <>
      <path d="M4 7h16" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6.5 7 7.4 19a2 2 0 0 0 2 1.9h5.2a2 2 0 0 0 2-1.9L17.5 7" />
    </>,
    p
  );
export const IconPlus = (p: IconProps) =>
  base(
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>,
    p
  );
export const IconMinus = (p: IconProps) => base(<path d="M5 12h14" />, p);

export const IconMail = (p: IconProps) =>
  base(
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </>,
    p
  );
export const IconPhone = (p: IconProps) =>
  base(
    <path d="M5.5 4h3.6l1.6 4-2.2 1.6a12.5 12.5 0 0 0 5.9 5.9l1.6-2.2 4 1.6v3.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 6.2 2 2 0 0 1 5.5 4Z" />,
    p
  );
export const IconMapPin = (p: IconProps) =>
  base(
    <>
      <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>,
    p
  );
export const IconInstagram = (p: IconProps) =>
  base(
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </>,
    p
  );

export const IconTruck = (p: IconProps) =>
  base(
    <>
      <path d="M3 6h11v10H3z" />
      <path d="M14 9h4l3 3v4h-7" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17.5" cy="18" r="1.8" />
    </>,
    p
  );
export const IconPackage = (p: IconProps) =>
  base(
    <>
      <path d="m12 3 8 4v10l-8 4-8-4V7l8-4Z" />
      <path d="m4 7 8 4 8-4" />
      <path d="M12 11v10" />
    </>,
    p
  );
export const IconShield = (p: IconProps) =>
  base(
    <>
      <path d="M12 3 5 6v5c0 5 3 8.4 7 10 4-1.6 7-5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4.5" />
    </>,
    p
  );
export const IconSparkle = (p: IconProps) =>
  base(
    <>
      <path d="M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8L12 4Z" />
      <path d="M18.5 16.5 19.2 18.4 21 19l-1.8.7-.7 1.8-.7-1.8L16 19l1.8-.6.7-1.9Z" />
    </>,
    p
  );

export const IconRocket = (p: IconProps) =>
  base(
    <>
      <path d="M12 3c3.5 1.8 5.5 5 5.5 9l-2.5 3h-6L6.5 12C6.5 8 8.5 4.8 12 3Z" />
      <circle cx="12" cy="9.5" r="2" />
      <path d="M8.5 15 7 19l3-1.5M15.5 15 17 19l-3-1.5" />
      <path d="M12 18.5V21" />
    </>,
    p
  );

export const IconPalette = (p: IconProps) =>
  base(
    <>
      <path d="M12 3a9 9 0 0 0 0 18c1.5 0 2-1 1.5-2-.6-1.2 0-2.5 1.5-2.5H17a4 4 0 0 0 4-4c0-5-4-9.5-9-9.5Z" />
      <circle cx="8" cy="10" r="1" fill="currentColor" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" />
      <circle cx="16" cy="10" r="1" fill="currentColor" />
      <circle cx="7.5" cy="14.5" r="1" fill="currentColor" />
    </>,
    p
  );

export const IconEdit = (p: IconProps) =>
  base(
    <>
      <path d="M4 20h4l11-11-4-4L4 16v4Z" />
      <path d="m13 7 4 4" />
    </>,
    p
  );

export const IconStore = (p: IconProps) =>
  base(
    <>
      <path d="M4 9 5.5 4h13L20 9" />
      <path d="M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
      <path d="M5 11.5V20h14v-8.5" />
      <path d="M9 20v-5h6v5" />
    </>,
    p
  );

export const IconGrid = (p: IconProps) =>
  base(
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>,
    p
  );
