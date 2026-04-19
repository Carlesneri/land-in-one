import { Modal } from "@/app/ui/Modal"

interface UploadProgressModalProps {
  isOpen: boolean
  progress: number
}

export function UploadProgressModal({
  isOpen,
  progress,
}: UploadProgressModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Uploading Image">
      <div className="space-y-4">
        <div className="w-full bg-slate-100 rounded-lg h-2 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-gray-600 font-medium">{progress}%</p>
      </div>
    </Modal>
  )
}
