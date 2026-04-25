import { Modal } from "@/app/ui/Modal"

interface AddElementModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (type: "text" | "image" | "image-text") => void
}

function TextSkeleton() {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="h-2.5 bg-blue-300 rounded-full w-full" />
      <div className="h-2.5 bg-blue-200 rounded-full w-5/6" />
      <div className="h-2.5 bg-blue-100 rounded-full w-4/6" />
    </div>
  )
}

function ImageSkeleton() {
  return (
    <div className="w-full h-10 bg-emerald-100 rounded-md flex items-center justify-center">
      <svg
        className="w-5 h-5 text-emerald-400"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  )
}

function ImageTextSkeleton() {
  return (
    <div className="w-full relative h-10 bg-amber-100 rounded-md flex items-center justify-center overflow-hidden">
      <svg
        className="w-5 h-5 text-amber-400"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
          clipRule="evenodd"
        />
      </svg>
      <div className="absolute inset-0 bg-linear-to-t from-amber-400/50 to-transparent flex items-end p-1.5">
        <div className="h-1.5 bg-white/80 rounded-full w-2/3" />
      </div>
    </div>
  )
}

export function AddElementModal({
  isOpen,
  onClose,
  onAdd,
}: AddElementModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add element">
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => onAdd("text")}
          className="w-full p-4 text-left border-2 border-blue-100 bg-blue-50 rounded-xl hover:border-blue-400 hover:bg-blue-100 transition-all flex items-center gap-4"
        >
          <div className="w-24 shrink-0">
            <TextSkeleton />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-base">Text</p>
            <p className="text-slate-500 text-sm mt-0.5">Rich text block</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onAdd("image")}
          className="w-full p-4 text-left border-2 border-emerald-100 bg-emerald-50 rounded-xl hover:border-emerald-400 hover:bg-emerald-100 transition-all flex items-center gap-4"
        >
          <div className="w-24 shrink-0">
            <ImageSkeleton />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-base">Image</p>
            <p className="text-slate-500 text-sm mt-0.5">Photo or graphic</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onAdd("image-text")}
          className="w-full p-4 text-left border-2 border-amber-100 bg-amber-50 rounded-xl hover:border-amber-400 hover:bg-amber-100 transition-all flex items-center gap-4"
        >
          <div className="w-24 shrink-0">
            <ImageTextSkeleton />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-base">
              Image with text
            </p>
            <p className="text-slate-500 text-sm mt-0.5">
              Image with overlay text
            </p>
          </div>
        </button>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full mt-6 py-2 text-slate-500 hover:text-slate-800 border-t border-slate-200 pt-5 font-medium text-sm transition-colors"
      >
        Cancel
      </button>
    </Modal>
  )
}
