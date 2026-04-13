"use client"

import type { LandingPageElement } from "@/types"

interface TextElementProps {
  element: LandingPageElement
  index: number
  onEdit: (element: LandingPageElement, index: number) => void
}

export function TextElement({ element, index, onEdit }: TextElementProps) {
  return (
    <button
      type="button"
      onClick={() => onEdit(element, index)}
      className="w-full text-left leading-relaxed cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
      style={{
        color: element.content ? "#1f2937" : "#9ca3af",
      }}
    >
      {(element.content as string) || "Click to edit text"}
    </button>
  )
}
