import React from "react"
import { cn } from "@/lib/utils"

interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)} {...props} />
  ),
)
FormGroup.displayName = "FormGroup"

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  htmlFor?: string
}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, required, children, htmlFor, ...props }, ref) => (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={cn("text-sm font-medium text-slate-900 block", className)}
      {...props}
    >
      {children}
      {required && <span className="text-red-600 ml-1">*</span>}
    </label>
  ),
)
FormLabel.displayName = "FormLabel"

interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormError = React.forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-red-600 font-medium", className)}
      {...props}
    />
  ),
)
FormError.displayName = "FormError"

interface FormHelpProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormHelp = React.forwardRef<HTMLParagraphElement, FormHelpProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-slate-500", className)}
      {...props}
    />
  ),
)
FormHelp.displayName = "FormHelp"

export { FormGroup, FormLabel, FormError, FormHelp }
