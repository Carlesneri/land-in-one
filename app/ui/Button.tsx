import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center squircle font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md focus-visible:ring-primary",
        secondary:
          "bg-secondary-light text-primary hover:bg-primary-light border border-secondary focus-visible:ring-primary",
        outline:
          "border-2 border-primary text-primary hover:bg-primary-light focus-visible:ring-primary",
        ghost:
          "text-text hover:bg-secondary-light hover:text-primary focus-visible:ring-primary",
        link: "text-text font-bold underline-offset-4 hover:underline focus-visible:ring-primary !px-0 !py-0",
        danger:
          "bg-danger text-white hover:bg-danger-hover shadow-sm hover:shadow-md focus-visible:ring-danger",
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
