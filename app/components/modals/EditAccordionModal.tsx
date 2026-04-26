import { Accordion } from "@mantine/core"
import { useRef, useState, useEffect } from "react"
import { Modal } from "@/app/ui/Modal"
import { RichTextEditor } from "@/app/components/builder/RichTextEditor"
import { uid } from "react-uid"
import { IconPlusFilled, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"
import { AccordionItemsSchema } from "@/app/components/modals/AccordionItemSchema"
import { Button } from "@/app/ui/Button"
import { cn } from "@/lib/utils"

export interface AccordionItem {
  title: string
  content: string
}

interface EditAccordionModalProps {
  isOpen: boolean
  items: AccordionItem[]
  onClose: () => void
  onSave: (items: AccordionItem[]) => void
}

function AccordionItemModal({
  item,
  id,
  onUpdate,
  onRemove,
  openIdx,
}: {
  item: AccordionItem
  id: number
  onUpdate: ({
    idx,
    title,
    content,
  }: {
    idx: number
    title: string
    content: string
  }) => void
  onRemove: (idx: number) => void
  openIdx: number | null
}) {
  const [title, setTitle] = useState(item.title)
  const [content, setContent] = useState(item.content)
  const titleInputRef = useRef<HTMLInputElement>(null)

  // Focus title input when this item is expanded
  useEffect(() => {
    if (openIdx === id && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [openIdx, id])

  // Add cancel handler to revert to initial values
  const handleCancel = () => {
    setTitle(item.title)
    setContent(item.content)
  }

  return (
    <Accordion.Item value={String(id)} key={uid(item)}>
      <Accordion.Control>
        <h3
          className={cn(
            item.title
              ? "text-lg font-semibold"
              : "text-sm font-medium text-slate-400",
          )}
        >
          {item.title || "Untitled"}
        </h3>
      </Accordion.Control>
      <Accordion.Panel className="relative">
        <input
          className="w-full mb-3 border rounded border-primary px-2 py-1 bg-transparent text-base font-semibold focus:ring-0 focus:outline-none placeholder:text-slate-400"
          placeholder={`Title ${id + 1}`}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
          }}
          aria-label={`Accordion title ${id + 1}`}
          ref={titleInputRef}
        />
        <div>
          <RichTextEditor
            content={content}
            onChange={(val) => setContent(val)}
          />
        </div>
        <div className="flex gap-3 pt-6 text-white w-full justify-between">
          <Button
            variant="primary"
            size="sm"
            className="flex items-center gap-1.5"
            onClick={() => onUpdate({ idx: id, title, content })}
            aria-label="Save current item"
            disabled={title === item.title && content === item.content}
          >
            Save
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-1.5"
            onClick={handleCancel}
            aria-label="Cancel editing item"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="flex items-center gap-1.5"
            onClick={() => onRemove(id)}
            aria-label="Remove current item"
          >
            <IconTrash size={14} aria-hidden="true" />
          </Button>
        </div>
      </Accordion.Panel>
    </Accordion.Item>
  )
}

export function EditAccordionModal({
  isOpen,
  items: initialItems,
  onClose,
  onSave,
}: EditAccordionModalProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [accordionItems, setAccordionItems] = useState(initialItems)

  const addItem = () => {
    setAccordionItems((prev) => [...prev, { title: "", content: "" }])
  }

  const updateItem = ({
    idx,
    title,
    content,
  }: {
    idx: number
    title: string
    content: string
  }) => {
    // Validate with item schema
    const result = AccordionItemsSchema.element.safeParse({ title, content })

    if (!result.success) {
      toast.error("Please fill in all required fields for this item.")
      return
    }

    setAccordionItems((prev) => {
      const newItems = [...prev]
      newItems[idx] = { ...newItems[idx], title, content }
      return newItems
    })
  }

  const removeItem = (idx: number) => {
    setAccordionItems((prev) => {
      const newItems = prev.filter((_, i) => i !== idx)
      if (openIdx === idx) setOpenIdx(null)
      return newItems
    })
  }

  const handleSave = () => {
    const result = AccordionItemsSchema.safeParse(accordionItems)
    if (!result.success) {
      toast.error("Please fill in all required fields.")
      return
    }

    onSave(accordionItems)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Accordion"
      size="large"
    >
      <div className="space-y-3">
        <Accordion
          value={openIdx !== null ? String(openIdx) : undefined}
          onChange={(val) => setOpenIdx(val !== null ? Number(val) : null)}
          classNames={{
            item: "border-2 border-slate-200 rounded-lg mb-2 bg-white",
            control:
              "flex items-center gap-2 px-3 py-2 bg-slate-50 border-b-2 border-slate-200 rounded-t-lg",
            content: "p-3",
          }}
        >
          {accordionItems.map((item, idx) => (
            <AccordionItemModal
              key={uid(item)}
              item={item}
              id={idx}
              onUpdate={updateItem}
              onRemove={removeItem}
              openIdx={openIdx}
            />
          ))}
        </Accordion>
      </div>
      <Button variant="secondary" type="button" onClick={addItem}>
        <IconPlusFilled size={18} aria-hidden="true" />
        <span>Add new item</span>
      </Button>
      <div className="flex gap-3 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 py-2 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
        >
          Save
        </button>
      </div>
    </Modal>
  )
}
