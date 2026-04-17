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
        "w-full py-2 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6442D6]",
        dragOverPosition === position
          ? "border-[#6442D6] bg-[#EDE9FB] text-[#6442D6]"
          : "border-[#C8B3FD] text-[#6442D6] hover:bg-[#F5F2FF] hover:border-[#6442D6]",
        className,
      )}
    >
      <IconPlus size={16} aria-hidden="true" />
      Add element
    </button>
  )
}
