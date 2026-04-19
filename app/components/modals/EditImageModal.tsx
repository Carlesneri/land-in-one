import { Modal } from "@/app/ui/Modal"

interface EditImageModalProps {
  isOpen: boolean
  editingImageId: string | null
  hasImage: boolean
  onClose: () => void
  onFileChange: (file: File) => void
  onRemove: () => void
}

export function EditImageModal({
  isOpen,
  editingImageId,
  hasImage,
  onClose,
  onFileChange,
  onRemove,
}: EditImageModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Image">
      <div className="space-y-3">
        <label
          htmlFor={`image-input-modal-${editingImageId}`}
          className="block w-full py-2 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg cursor-pointer transition-colors text-center"
        >
          Change Image
        </label>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id={`image-input-modal-${editingImageId}`}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              onFileChange(file)
              onClose()
            }
          }}
        />

        {hasImage && (
          <button
            type="button"
            onClick={onRemove}
            className="w-full py-2 px-4 bg-warning-light hover:bg-warning-light-hover text-warning font-medium rounded-lg transition-colors"
          >
            Remove Image
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}
