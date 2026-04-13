"use client"

import { cn } from "@/lib/utils"

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
        "w-full py-2 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm font-medium transition-colors",
        dragOverPosition === position
          ? "border-blue-500 bg-blue-50 text-blue-600"
          : "border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400",
        className,
      )}
    >
      <span className="text-lg">+</span>
      Add element
    </button>
  )
}
