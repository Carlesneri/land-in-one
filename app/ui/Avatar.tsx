import React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  size?: "sm" | "md" | "lg" | "xl"
  initials?: string
  fallbackColor?: "indigo" | "blue" | "purple" | "slate"
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
}

const fallbackColors = {
  indigo: "bg-gradient-to-br from-indigo-400 to-indigo-600",
  blue: "bg-gradient-to-br from-blue-400 to-blue-600",
  purple: "bg-gradient-to-br from-purple-400 to-purple-600",
  slate: "bg-gradient-to-br from-slate-400 to-slate-600",
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt,
      size = "md",
      initials,
      fallbackColor = "indigo",
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        sizeClasses[size],
        "rounded-full flex items-center justify-center overflow-hidden shrink-0",
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
