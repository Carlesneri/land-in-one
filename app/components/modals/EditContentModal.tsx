import { Modal } from "@/app/ui/Modal"
import { RichTextEditor } from "@/app/components/builder/RichTextEditor"
import type { LandingPageElement } from "@/types"

interface EditContentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  elementType: LandingPageElement["type"] | undefined
  content: string
  onChange: (value: string) => void
}

export function EditContentModal({
  isOpen,
  onClose,
  onSave,
  elementType,
  content,
  onChange,
}: EditContentModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Content" size="large">
      <div className="space-y-4">
        {elementType === "text" ? (
          <RichTextEditor content={content} onChange={onChange} />
        ) : (
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your content here..."
            // biome-ignore lint/a11y/noAutofocus: intentional focus when edit modal opens
            autoFocus
            className="w-full h-32 p-3 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none resize-none"
          />
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-text font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex-1 py-2 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  )
}
