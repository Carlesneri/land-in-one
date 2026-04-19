import { useState, useEffect } from "react"
import { Modal } from "@/app/ui/Modal"
import { savePreviewPage } from "@/app/actions/pages"
import { toast } from "sonner"
import type { LandingPageElement } from "@/types"

interface LandingModeModalProps {
  isOpen: boolean
  pageId: string
  pageSlug: string
  elements: LandingPageElement[]
  pageMode: "light" | "dark"
  onModeChange: (mode: "light" | "dark") => void
  onClose: () => void
}

export function LandingModeModal({
  isOpen,
  pageId,
  pageSlug,
  elements,
  pageMode,
  onModeChange,
  onClose,
}: LandingModeModalProps) {
  const [selectedMode, setSelectedMode] = useState<"light" | "dark">(pageMode)

  useEffect(() => {
    if (isOpen) setSelectedMode(pageMode)
  }, [isOpen, pageMode])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Color mode">
      <div className="space-y-4">
        <div>
          <select
            id="landing-mode-select"
            value={selectedMode}
            onChange={(e) =>
              setSelectedMode(e.target.value as "light" | "dark")
            }
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-text font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onModeChange(selectedMode)
              onClose()
              savePreviewPage(pageId, {
                slug: pageSlug,
                elements,
                mode: selectedMode,
              }).catch(() => toast.error("Failed to save options"))
              toast.success(`Switched to ${selectedMode} mode`)
            }}
            className="flex-1 py-2 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  )
}
