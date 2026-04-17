import React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helperText, type = "text", ...props }, ref) => (
    <div className="w-full">
      <input
        type={type}
        className={cn(
          "w-full px-4 py-2.5 text-base rounded-lg border-2 transition-all duration-200",
          "bg-white text-[#111827] placeholder:text-slate-400",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
          error
            ? "border-[#DC2626] focus:border-[#DC2626] focus-visible:ring-[#DC2626]/20"
            : "border-slate-200 focus:border-[#6442D6] focus-visible:ring-[#6442D6]/20",
          className,
        )}
        ref={ref}
        {...props}
      />
      {helperText && (
        <p
          className={cn(
            "mt-1 text-sm",
            error ? "text-red-600" : "text-slate-600",
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  ),
)
Input.displayName = "Input"

export { Input }
