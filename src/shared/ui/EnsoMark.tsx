export const EnsoMark = ({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M81 28C72 12 52 8 35 15C16 22 8 42 14 60C21 80 42 91 62 84C76 79 86 69 89 56"
      stroke="var(--token)"
      strokeWidth="9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M77 23C66 11 49 9 34 16C20 22 11 35 11 49M89 54L94 62M87 58L91 68"
      stroke="var(--token)"
      strokeWidth="2.4"
      strokeLinecap="round"
      opacity="0.56"
    />
  </svg>
);
