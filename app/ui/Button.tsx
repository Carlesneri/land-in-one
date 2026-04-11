import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-md hover:shadow-lg focus:ring-indigo-500",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-300 border border-slate-200",
        outline:
          "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
        ghost:
          "text-slate-700 hover:bg-slate-100 focus:ring-slate-300 hover:text-slate-900",
        danger:
          "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg focus:ring-red-500",
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
