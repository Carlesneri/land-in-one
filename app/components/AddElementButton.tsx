"use client"

import { cn } from "@/lib/utils"
import { IconPlus } from "@tabler/icons-react"

interface AddElementButtonProps {
  position: number
  dragOverPosition: number | null
  onDragOver: (e: React.DragEvent, position: number) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent, position: number) => void
  onClick: (position: number) => void
  className?: string
}

export function AddElementButton({
  position,
  dragOverPosition,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  className,
}: AddElementButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(position)}
      onDragOver={(e) => onDragOver(e, position)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, position)}
      className={cn(
        "w-full py-3 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
        dragOverPosition === position
          ? "border-slate-400 bg-slate-100 text-slate-600"
          : "border-slate-300 text-slate-400 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-600",
        className,
      )}
    >
      <IconPlus size={16} aria-hidden="true" />
      Add element
    </button>
  )
}
