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
      className="w-full text-left cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6442D6] rounded px-2 py-1"
    >
      {element.content ? (
        <div
          className="prose prose-sm max-w-none text-gray-800 leading-relaxed pointer-events-none"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: content is user-authored rich text from Tiptap
          dangerouslySetInnerHTML={{ __html: element.content }}
        />
      ) : (
        <span className="text-gray-400">Click to edit text…</span>
      )}
    </button>
  )
}
