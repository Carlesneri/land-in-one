import React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "animate-pulse squircle bg-linear-to-r from-slate-200 to-slate-100",
        className,
      )}
      {...props}
    />
  ),
)
Skeleton.displayName = "Skeleton"

export { Skeleton }
