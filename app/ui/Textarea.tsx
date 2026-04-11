import React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  helperText?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, helperText, ...props }, ref) => (
    <div className="w-full">
      <textarea
        className={cn(
          "w-full px-4 py-2.5 text-base rounded-lg border-2 transition-all duration-200",
          "bg-white text-slate-900 placeholder:text-slate-400",
          "focus:outline-none focus:ring-2 focus:ring-offset-0 resize-vertical",
          error
            ? "border-red-500 focus:border-red-600 focus:ring-red-200"
            : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-200",
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
Textarea.displayName = "Textarea"

export { Textarea }
