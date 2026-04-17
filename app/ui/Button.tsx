import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-[#6442D6] text-white hover:bg-[#5234C0] shadow-sm hover:shadow-md focus-visible:ring-[#6442D6]",
        secondary:
          "bg-[#F5F2FF] text-[#6442D6] hover:bg-[#EDE9FB] border border-[#C8B3FD] focus-visible:ring-[#6442D6]",
        outline:
          "border-2 border-[#6442D6] text-[#6442D6] hover:bg-[#EDE9FB] focus-visible:ring-[#6442D6]",
        ghost:
          "text-[#111827] hover:bg-[#F5F2FF] hover:text-[#6442D6] focus-visible:ring-[#6442D6]",
        danger:
          "bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-sm hover:shadow-md focus-visible:ring-[#DC2626]",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2.5 text-base",
        lg: "px-6 py-3 text-lg",
        icon: "h-10 w-10 p-0",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      ref={ref}
      {...props}
    />
  ),
)
Button.displayName = "Button"

export { Button, buttonVariants }
