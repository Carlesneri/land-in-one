"use client"

import { useState } from "react"
import type { TextElement as TextElementType } from "@/types"
import { EditContentModal } from "@/app/components/modals/EditContentModal"

interface TextElementProps {
  element: TextElementType
  onSave: (content: string) => void
}

export function TextElement({ element, onSave }: TextElementProps) {
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
    <>
      <button
        type="button"
        onClick={open}
        className="w-full text-left cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1"
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

      <EditContentModal
        isOpen={isOpen}
        onClose={close}
        onSave={save}
        elementType="text"
        content={draft}
        onChange={setDraft}
      />
    </>
  )
}
