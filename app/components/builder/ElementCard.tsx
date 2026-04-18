"use client"

import { IconGripVertical, IconSettings, IconTrash } from "@tabler/icons-react"
import type { LandingPageElement } from "@/types"
import { toast } from "sonner"

interface ElementCardProps {
  element: LandingPageElement
  index: number
  onDragStart: (e: React.DragEvent, index: number) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, index: number) => void
  onDragEnd: () => void
  onDelete: (index: number) => void
  onOpenOptions?: (index: number) => void
  children: React.ReactNode
}

export function ElementCard({
  element,
  index,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onDelete,
  onOpenOptions,
  children,
}: ElementCardProps) {
  const hasOptions = element.type === "headline" || element.type === "image"

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: to fix forward
    <div
      className="relative p-4 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 hover:border-[#C8B3FD] transition-colors group cursor-move"
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={onDragEnd}
    >
      {/* Top info bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center gap-2 px-3 py-1 bg-slate-100 border-b border-slate-200 rounded-t-lg text-xs text-slate-400 font-medium select-none pointer-events-none">
        {element.type === "headline" && (
          <>
            <span className="uppercase tracking-wide">Headline</span>
            <span className="text-[#16A34A] font-semibold">
              H{element.headlineLevel ?? 1}
            </span>
          </>
        )}
        {element.type === "text" && (
          <span className="uppercase tracking-wide">Text</span>
        )}
        {element.type === "image" && (
          <>
            <span className="uppercase tracking-wide">Image</span>
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
                      className="inline-block bg-[#16A34A] rounded-xs shrink-0"
                      style={{ width: rectW, height: rectH }}
                    />
                  )
                })()}
                <span className="text-[#16A34A] font-semibold">
                  {element.aspectRatio.replace("/", ":")}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Right sidebar — drag handle, options, delete */}
      <div className="absolute top-8 bottom-2 right-2 flex flex-col items-center justify-between z-10">
        <div className="flex flex-col items-center gap-1">
          <div
            className="flex items-center justify-center text-slate-300 hover:text-[#6442D6] transition-colors"
            onTouchStart={() => toast.info("Long press to drag and reorder")}
          >
            <IconGripVertical size={20} aria-hidden="true" />
          </div>
          {hasOptions && onOpenOptions && (
            <button
              type="button"
              title="Element options"
              onClick={(e) => {
                e.stopPropagation()
                onOpenOptions(index)
              }}
              className="flex items-center justify-center text-slate-300 hover:text-[#6442D6] transition-colors"
            >
              <IconSettings size={16} aria-hidden="true" />
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
          className="flex items-center justify-center text-red-300 hover:text-red-500 transition-colors"
        >
          <IconTrash size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Content */}
      <div className="w-full pr-8 pt-6">{children}</div>
    </div>
  )
}
