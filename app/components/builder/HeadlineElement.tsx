"use client"

import type { LandingPageElement } from "@/types"

interface HeadlineElementProps {
  element: LandingPageElement
  index: number
  onEdit: (element: LandingPageElement, index: number) => void
}

export function HeadlineElement({
  element,
  index,
  onEdit,
}: HeadlineElementProps) {
  return (
    <button
      type="button"
      onClick={() => onEdit(element, index)}
      className="w-full text-left text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6442D6] rounded px-2 py-1"
      style={{
        color: element.content ? "#1f2937" : "#d1d5db",
      }}
    >
      {(element.content as string) || "Click to edit headline"}
    </button>
  )
}
