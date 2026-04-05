export const SamuraiMark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 200 480"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    {/* Kasa (conical hat) */}
    <path d="M100 6 Q55 40 28 52 Q100 44 172 52 Q145 40 100 6Z" />

    {/* Head */}
    <ellipse cx="100" cy="68" rx="16" ry="18" opacity="0.9" />

    {/* Left shoulder & torso */}
    <path
      d="M84 86 Q58 94 30 108 Q24 115 28 185 L36 232 L96 232 L96 86Z"
      opacity="0.88"
    />

    {/* Right shoulder & torso */}
    <path
      d="M116 86 Q142 94 170 108 Q176 115 172 185 L164 232 L104 232 L104 86Z"
      opacity="0.88"
    />

    {/* Obi (belt) */}
    <path d="M34 230 Q100 224 166 230 L166 246 Q100 240 34 246Z" />

    {/* Left hakama leg */}
    <path
      d="M34 246 Q22 335 12 420 Q8 452 22 468 L96 468 Q98 400 96 340 Q95 290 96 246Z"
      opacity="0.9"
    />

    {/* Right hakama leg */}
    <path
      d="M166 246 Q178 335 188 420 Q192 452 178 468 L104 468 Q102 400 104 340 Q105 290 104 246Z"
      opacity="0.9"
    />

    {/* Katana hilt rising behind shoulder */}
    <path
      d="M162 95 Q168 65 172 30 Q173 15 170 8"
      fill="none"
      stroke="currentColor"
      strokeWidth="4.5"
      strokeLinecap="round"
      opacity="0.75"
    />

    {/* Tsuba (hand guard) */}
    <ellipse
      cx="161"
      cy="100"
      rx="8"
      ry="3"
      opacity="0.7"
      transform="rotate(-82 161 100)"
    />
  </svg>
);
