import { Modal } from "@/app/ui/Modal"

interface ChangeNameModalProps {
  isOpen: boolean
  pageName?: string
  onClose: () => void
  onSave: (newName?: string) => void
}

export function ChangeNameModal({
  isOpen,
  pageName,
  onClose,
  onSave,
}: ChangeNameModalProps) {
  const handleClose = () => {
    onClose()
  }

  const handleSave = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const pageName = formData.get("pageName") as string

    onSave(pageName?.trim())
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Name">
      <form className="space-y-4" onSubmit={handleSave}>
        <p className="text-gray-600 text-sm">Enter a new name for your page.</p>

        <div className="space-y-1">
          <input
            type="text"
            name="pageName"
            defaultValue={pageName}
            placeholder="My landing page"
            className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors border-slate-200 focus:border-primary"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-text font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  )
}
