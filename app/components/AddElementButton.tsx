"use client"

import { cn } from "@/lib/utils"
import { IconPlus } from "@tabler/icons-react"

interface AddElementButtonProps {
  onClick: () => void
  className?: string
}

export function AddElementButton({
  onClick,
  className,
}: AddElementButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full py-3 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
        "border-slate-300 text-slate-400 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-600",
        className,
      )}
    >
      <IconPlus size={16} aria-hidden="true" />
      Add element
    </button>
  )
}
