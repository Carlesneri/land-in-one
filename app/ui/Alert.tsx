import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva("relative w-full rounded-lg border-l-4 p-4 text-sm", {
  variants: {
    variant: {
      default: "border-l-[#6442D6] bg-[#F5F2FF] text-[#111827]",
      success: "border-l-[#16A34A] bg-[#DCFCE7] text-[#14532D]",
      warning: "border-l-[#D97706] bg-[#FEF3C7] text-[#78350F]",
      danger: "border-l-[#DC2626] bg-[#FEE2E2] text-[#7F1D1D]",
      info: "border-l-[#6442D6] bg-[#EDE9FB] text-[#6442D6]",
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
