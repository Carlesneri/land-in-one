import React from "react"
import { cn } from "@/lib/utils"

interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  ({ className, icon, title, description, action, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 rounded-lg",
        "bg-linear-to-br from-slate-50 to-slate-100 border border-slate-200",
        className,
      )}
      {...props}
    >
      {icon && <div className="mb-4 text-slate-400">{icon}</div>}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-600 text-center max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  ),
)
Empty.displayName = "Empty"

export { Empty }
