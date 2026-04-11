import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva("relative w-full rounded-lg border-l-4 p-4 text-sm", {
  variants: {
    variant: {
      default: "border-l-slate-500 bg-slate-50 text-slate-900",
      success: "border-l-emerald-500 bg-emerald-50 text-emerald-900",
      warning: "border-l-amber-500 bg-amber-50 text-amber-900",
      danger: "border-l-red-500 bg-red-50 text-red-900",
      info: "border-l-blue-500 bg-blue-50 text-blue-900",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(alertVariants({ variant }), className)}
      role="alert"
      {...props}
    />
  ),
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn("font-semibold mb-1", className)} {...props} />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm", className)} {...props} />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
