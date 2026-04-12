export function Logo({
  width = 800,
  height = 400,
}: {
  width?: number
  height?: number
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 220"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Land In One Logo</title>
      <g fill="currentColor">
        <rect x="40" y="40" width="10" height="50" />
        <rect x="50" y="80" width="30" height="10" />

        <rect x="90" y="50" width="10" height="40" />
        <rect x="120" y="50" width="10" height="40" />
        <rect x="100" y="40" width="20" height="10" />
        <rect x="100" y="65" width="20" height="10" />

        <rect x="140" y="40" width="10" height="50" />
        <rect x="170" y="40" width="10" height="50" />
        <rect x="150" y="50" width="10" height="10" />
        <rect x="160" y="60" width="10" height="10" />

        <rect x="190" y="40" width="10" height="50" />
        <rect x="200" y="40" width="20" height="10" />
        <rect x="200" y="80" width="20" height="10" />
        <rect x="220" y="50" width="10" height="30" />

        <rect x="40" y="120" width="30" height="10" />
        <rect x="50" y="130" width="10" height="30" />
        <rect x="40" y="160" width="30" height="10" />

        <rect x="80" y="120" width="10" height="50" />
        <rect x="110" y="120" width="10" height="50" />
        <rect x="90" y="130" width="10" height="10" />
        <rect x="100" y="140" width="10" height="10" />

        <rect x="140" y="120" width="30" height="10" />
        <rect x="140" y="160" width="30" height="10" />
        <rect x="140" y="130" width="10" height="30" />
        <rect x="160" y="130" width="10" height="30" />

        <rect x="180" y="120" width="10" height="50" />
        <rect x="210" y="120" width="10" height="50" />
        <rect x="190" y="130" width="10" height="10" />
        <rect x="200" y="140" width="10" height="10" />

        <rect x="230" y="120" width="10" height="50" />
        <rect x="240" y="120" width="30" height="10" />
        <rect x="240" y="140" width="20" height="10" />
        <rect x="240" y="160" width="30" height="10" />
      </g>
    </svg>
  )
}
