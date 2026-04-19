import { Modal } from "@/app/ui/Modal"

interface DeleteProjectModalProps {
  isOpen: boolean
  pageSlug: string
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteProjectModal({
  isOpen,
  pageSlug,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteProjectModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Project">
      <p className="text-gray-600 mb-2">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-text">{pageSlug}</span>? This action
        cannot be undone.
      </p>
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-text font-medium rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-medium rounded-lg transition-colors"
        >
          {isDeleting ? "Deleting…" : "Delete Project"}
        </button>
      </div>
    </Modal>
  )
}
