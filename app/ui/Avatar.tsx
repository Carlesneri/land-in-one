import React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  size?: "sm" | "md" | "lg" | "xl"
  initials?: string
  fallbackColor?: "primary" | "secondary" | "slate"
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
}

const fallbackColors = {
  primary: "bg-[#6442D6] text-white",
  secondary: "bg-[#C8B3FD] text-[#6442D6]",
  slate: "bg-slate-200 text-slate-700",
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt,
      size = "md",
      initials,
      fallbackColor = "primary",
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        sizeClasses[size],
        "squircle-lg flex items-center justify-center overflow-hidden shrink-0",
        src ? "bg-slate-100" : fallbackColors[fallbackColor],
        className,
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || "Avatar"}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-white font-semibold">{initials}</span>
      )}
    </div>
  ),
)
Avatar.displayName = "Avatar"

export { Avatar }
