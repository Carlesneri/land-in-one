import Image from "next/image"

export function Logo({
  width = 800,
  height = 400,
}: {
  width?: number
  height?: number
}) {
  return (
    <Image
      src="/logo.png"
      alt="Land In One logo"
      width={width}
      height={height}
    />
  )
}
