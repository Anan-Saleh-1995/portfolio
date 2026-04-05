export function EnsoMark({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="var(--token)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="220 30"
      />
    </svg>
  );
}
