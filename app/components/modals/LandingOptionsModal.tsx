import { Modal } from "@/app/ui/Modal"
import { savePreviewPage } from "@/app/actions/pages"
import { toast } from "sonner"
import type { LandingPageElement } from "@/types"

interface LandingOptionsModalProps {
  isOpen: boolean
  pageId: string
  pageSlug: string
  elements: LandingPageElement[]
  pageMode: "light" | "dark"
  onModeChange: (mode: "light" | "dark") => void
  onClose: () => void
}

export function LandingOptionsModal({
  isOpen,
  pageId,
  pageSlug,
  elements,
  pageMode,
  onModeChange,
  onClose,
}: LandingOptionsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Landing Options">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="landing-mode-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Color mode
          </label>
          <select
            id="landing-mode-select"
            value={pageMode}
            onChange={(e) => onModeChange(e.target.value as "light" | "dark")}
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
              onClose()
              savePreviewPage(pageId, {
                slug: pageSlug,
                elements,
                mode: pageMode,
              }).catch(() => toast.error("Failed to save options"))
              toast.success("Options saved")
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
