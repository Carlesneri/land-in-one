"use client"

import { useState } from "react"
import type { TextElement as TextElementType } from "@/types"
import { EditContentModal } from "@/app/components/modals/EditContentModal"
import { ElementCard } from "@/app/components/builder/ElementCard"

interface TextElementProps {
  element: TextElementType
  index: number
  onSave: (content: string) => void
  onDelete: (index: number) => void
  onOpenOptions?: (index: number) => void
}

export function TextElement({
  element,
  index,
  onSave,
  onDelete,
  onOpenOptions,
}: TextElementProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState("")

  const open = () => {
    setDraft(element.content)
    setIsOpen(true)
  }

  const close = () => setIsOpen(false)

  const save = () => {
    onSave(draft)
    close()
  }

  return (
    <ElementCard
      element={element}
      index={index}
      onDelete={onDelete}
      onOpenOptions={onOpenOptions}
    >
      <button
        type="button"
        onClick={open}
        className="w-full text-left cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1"
      >
        {element.content ? (
          <div
            className="rich-text-lio prose prose-sm max-w-none text-gray-800 leading-relaxed pointer-events-none overflow-hidden line-clamp-5"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: content is user-authored rich text from Tiptap
            dangerouslySetInnerHTML={{ __html: element.content }}
          />
        ) : (
          <span className="text-gray-400">Click to edit text…</span>
        )}
      </button>

      <EditContentModal
        isOpen={isOpen}
        onClose={close}
        onSave={save}
        elementType="text"
        content={draft}
        onChange={setDraft}
      />
    </ElementCard>
  )
}
