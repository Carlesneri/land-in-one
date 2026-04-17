import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#EDE9FB] text-[#6442D6] border border-[#C8B3FD]",
        success: "bg-[#DCFCE7] text-[#16A34A] border border-[#86EFAC]",
        warning: "bg-[#FEF3C7] text-[#D97706] border border-[#FCD34D]",
        danger: "bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]",
        slate: "bg-slate-100 text-slate-700 border border-slate-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
