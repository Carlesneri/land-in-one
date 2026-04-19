import { Modal } from "@/app/ui/Modal"

interface AddElementModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (type: "text" | "image" | "headline") => void
}

export function AddElementModal({
  isOpen,
  onClose,
  onAdd,
}: AddElementModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Element">
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => onAdd("headline")}
          className="w-full p-3 sm:p-4 text-left border-2 border-slate-200 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3"
        >
          <span className="text-xl sm:text-2xl">📰</span>
          <span className="font-semibold text-text text-sm sm:text-base">
            Headline
          </span>
        </button>

        <button
          type="button"
          onClick={() => onAdd("text")}
          className="w-full p-3 sm:p-4 text-left border-2 border-slate-200 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3"
        >
          <span className="text-xl sm:text-2xl">📝</span>
          <span className="font-semibold text-text text-sm sm:text-base">
            Text
          </span>
        </button>

        <button
          type="button"
          onClick={() => onAdd("image")}
          className="w-full p-3 sm:p-4 text-left border-2 border-slate-200 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3"
        >
          <span className="text-xl sm:text-2xl">🖼️</span>
          <span className="font-semibold text-text text-sm sm:text-base">
            Image
          </span>
        </button>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full mt-6 py-2 text-gray-600 hover:text-gray-900 border-t border-gray-200 pt-6 font-medium text-sm sm:text-base"
      >
        Cancel
      </button>
    </Modal>
  )
}
