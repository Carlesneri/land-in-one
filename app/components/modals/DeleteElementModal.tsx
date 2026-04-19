import { Modal } from "@/app/ui/Modal"

interface DeleteElementModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteElementModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteElementModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Remove Element">
      <p className="text-gray-600 mb-6">
        Are you sure you want to remove this element? This action cannot be
        undone.
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
        >
          Remove
        </button>
      </div>
    </Modal>
  )
}
