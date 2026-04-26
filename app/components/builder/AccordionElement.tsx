import { useState } from "react"
import type { AccordionElement as AccordionElementType } from "@/types"
import { EditAccordionModal } from "@/app/components/modals/EditAccordionModal"
import { ElementCard } from "@/app/components/builder/ElementCard"

interface AccordionElementProps {
  element: AccordionElementType
  index: number
  onDelete: (index: number) => void
  onSave: (items: { title: string; content: string }[]) => void
}

export function AccordionElement({
  element,
  index,
  onDelete,
  onSave,
}: AccordionElementProps) {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => {
    setIsOpen(true)
  }

  const close = () => setIsOpen(false)
  const save = (items: { title: string; content: string }[]) => {
    if (onSave) onSave(items)
    close()
  }

  const first = element.items?.[0]
  const hasItems =
    element.items && element.items.length > 0 && (first.title || first.content)

  return (
    <ElementCard element={element} index={index} onDelete={onDelete}>
      <button
        type="button"
        onClick={open}
        className="w-full text-left cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1"
      >
        {hasItems ? (
          <div>
            <div className="font-semibold text-purple-900 line-clamp-1">
              {first.title || "Accordion title"}
            </div>
            <div
              className="text-purple-800 mt-1 line-clamp-2 prose prose-sm max-w-none"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: content is user-authored rich text from Tiptap
              dangerouslySetInnerHTML={{
                __html: first.content || "Accordion content",
              }}
            />
          </div>
        ) : (
          <span className="text-gray-400">Click to add accordion items…</span>
        )}
      </button>
      <EditAccordionModal
        isOpen={isOpen}
        items={element.items || []}
        onClose={close}
        onSave={save}
      />
    </ElementCard>
  )
}
