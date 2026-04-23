"use client"

import { IconGripVertical, IconSettings, IconTrash } from "@tabler/icons-react"
import type { LandingPageElement } from "@/types"
import { useSortable } from "@dnd-kit/react/sortable"
import { cn } from "@/lib/utils"

interface ElementCardProps {
  element: LandingPageElement
  index: number
  onDelete: (index: number) => void
  onOpenOptions?: (index: number) => void
  children: React.ReactNode
}

export function ElementCard({
  element,
  index,
  onDelete,
  onOpenOptions,
  children,
}: ElementCardProps) {
  const hasOptions = element.type === "image" || element.type === "image-text"
  const { ref, handleRef, isDragging } = useSortable({
    id: element.id,
    index,
  })

  return (
    <div
      ref={ref}
      className={cn(
        "bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 hover:border-secondary transition-colors group overflow-hidden",
        isDragging && "opacity-50",
      )}
    >
      {/* Top info bar */}
      <div
        ref={handleRef}
        className="flex items-center gap-2 px-3 py-1 bg-slate-100 border-b border-slate-200 text-xs text-slate-400 font-medium select-none cursor-move"
      >
        {element.type === "text" && (
          <span className="uppercase tracking-wide">Text</span>
        )}
        {(element.type === "image" || element.type === "image-text") && (
          <>
            <span className="uppercase tracking-wide">
              {element.type === "image-text" ? "Image + Text" : "Image"}
            </span>
            {element.aspectRatio && (
              <div className="flex items-center gap-1">
                {(() => {
                  const [w, h] = element.aspectRatio.split("/").map(Number)
                  const maxH = 14
                  const maxW = 20
                  const scale = Math.min(maxW / w, maxH / h)
                  const rectW = Math.round(w * scale)
                  const rectH = Math.round(h * scale)
                  return (
                    <span
                      className="inline-block bg-success rounded-xs shrink-0"
                      style={{ width: rectW, height: rectH }}
                    />
                  )
                })()}
                <span className="text-success font-semibold">
                  {element.aspectRatio.replace("/", ":")}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Body: content + sidebar */}
      <div className="flex gap-2 p-3">
        {/* Main content */}
        <div className="flex-1 min-w-0">{children}</div>

        {/* Options sidebar */}
        <div className="flex flex-col items-center justify-between shrink-0 py-1">
          <div className="flex flex-col items-center gap-1.5">
            <div
              ref={handleRef}
              className="flex items-center justify-center text-slate-400 hover:text-primary transition-colors cursor-move"
            >
              <IconGripVertical size={22} aria-hidden="true" />
            </div>
            {hasOptions && onOpenOptions && (
              <button
                type="button"
                title="Element options"
                onClick={(e) => {
                  e.stopPropagation()
                  onOpenOptions(index)
                }}
                className="flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
              >
                <IconSettings size={18} aria-hidden="true" />
              </button>
            )}
          </div>
          <button
            type="button"
            title="Delete element"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(index)
            }}
            className="flex items-center justify-center text-red-400 hover:text-red-600 transition-colors mt-4"
          >
            <IconTrash size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
