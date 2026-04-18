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
  const level = element.headlineLevel ?? 1
  const sizeClasses: Record<number, string> = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
    5: "text-lg",
    6: "text-base",
  }

  return (
    <button
      type="button"
      onClick={() => onEdit(element, index)}
      className={`w-full text-left ${sizeClasses[level]} font-bold cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1`}
      style={{
        color: element.content ? "#1f2937" : "#d1d5db",
      }}
    >
      {(element.content as string) || "Click to edit headline"}
    </button>
  )
}
