"use client"

import { useRef } from "react"
import Image from "next/image"
import { Modal } from "@/app/ui/Modal"
import { RichTextEditor } from "@/app/components/builder/RichTextEditor"
import { IconPhoto } from "@tabler/icons-react"

interface EditImageTextModalProps {
  isOpen: boolean
  image: string
  text: string
  onClose: () => void
  onImageChange: (file: File) => void
  onImageRemove: () => void
  onTextChange: (value: string) => void
  onSave: () => void
}

export function EditImageTextModal({
  isOpen,
  image,
  text,
  onClose,
  onImageChange,
  onImageRemove,
  onTextChange,
  onSave,
}: EditImageTextModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Image & Text"
      size="large"
    >
      <div className="space-y-5">
        {/* Image section */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Image</p>
          {image ? (
            <div className="space-y-3">
              <div className="relative w-full rounded-lg overflow-hidden bg-slate-100">
                <Image
                  src={image}
                  alt="Element image"
                  width={800}
                  height={400}
                  className="w-full object-cover rounded-lg max-h-52"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors text-sm"
                >
                  Change Image
                </button>
                <button
                  type="button"
                  onClick={onImageRemove}
                  className="flex-1 py-2 px-4 bg-warning-light hover:bg-warning-light-hover text-warning font-medium rounded-lg transition-colors text-sm"
                >
                  Remove Image
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-28 rounded-lg border-2 border-dashed border-slate-300 hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center gap-2 transition-colors"
            >
              <IconPhoto
                size={28}
                className="text-slate-400"
                aria-hidden="true"
              />
              <span className="text-sm text-slate-500 font-medium">
                Click to add image
              </span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                onImageChange(file)
                // reset so same file can be picked again
                e.target.value = ""
              }
            }}
          />
        </div>

        {/* Text section */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">
            Overlay text
          </p>
          <RichTextEditor content={text} onChange={onTextChange} colorPicker />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
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
