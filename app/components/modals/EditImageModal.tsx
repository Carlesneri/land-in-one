"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Modal } from "@/app/ui/Modal"
import type { AspectRatio } from "@/types"
import { IconPhoto } from "@tabler/icons-react"

interface EditImageModalProps {
  isOpen: boolean
  editingImageId: string | null
  imageUrl?: string
  aspectRatio?: AspectRatio
  onClose: () => void
  onSelectFile: (file: File) => void // kept for back-compat but unused when onSave carries pendingFile
  onRemove: () => void // kept for back-compat but unused when onSave carries imageRemoved
  onSave: (
    aspectRatio: AspectRatio | undefined,
    pendingFile?: File,
    imageRemoved?: boolean,
  ) => void
}

const ASPECT_RATIO_OPTIONS: { label: string; value: AspectRatio | "" }[] = [
  { label: "Original (no crop)", value: "" },
  { label: "16:9 (Landscape)", value: "16/9" },
  { label: "4:3", value: "4/3" },
  { label: "1:1 (Square)", value: "1/1" },
  { label: "3:4 (Portrait)", value: "3/4" },
  { label: "9:16 (Portrait)", value: "9/16" },
]

export function EditImageModal({
  isOpen,
  editingImageId,
  imageUrl,
  aspectRatio,
  onClose,
  onSave,
}: EditImageModalProps) {
  const [draftRatio, setDraftRatio] = useState<AspectRatio | "">(
    aspectRatio ?? "",
  )
  const [draftFile, setDraftFile] = useState<File | null>(null)
  const [draftRemoved, setDraftRemoved] = useState(false)

  // Reset draft state when modal opens
  // biome-ignore lint/correctness/useExhaustiveDependencies: sync on open only
  useEffect(() => {
    if (isOpen) {
      setDraftRatio(aspectRatio ?? "")
      setDraftFile(null)
      setDraftRemoved(false)
    }
  }, [isOpen])

  // Derive what image to preview
  const previewUrl = draftFile
    ? URL.createObjectURL(draftFile)
    : draftRemoved
      ? null
      : imageUrl || null

  const handleSave = () => {
    onSave(
      draftRatio ? (draftRatio as AspectRatio) : undefined,
      draftFile ?? undefined,
      draftRemoved || undefined,
    )
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Image">
      <div className="space-y-4">
        {/* Image preview */}
        <div className="w-full rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center min-h-32">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Preview"
              width={800}
              height={400}
              className="w-full h-auto object-cover rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 py-6 text-slate-400">
              <IconPhoto size={40} aria-hidden="true" />
              <span className="text-sm">No image selected</span>
            </div>
          )}
        </div>

        {/* Image actions */}
        <div className="flex gap-2">
          <label
            htmlFor={`image-input-modal-${editingImageId}`}
            className="flex-1 py-2 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg cursor-pointer transition-colors text-center text-sm"
          >
            {previewUrl ? "Change Image" : "Add Image"}
          </label>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id={`image-input-modal-${editingImageId}`}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setDraftFile(file)
                setDraftRemoved(false)
              }
              if (e.target) e.target.value = ""
            }}
          />
          {previewUrl && (
            <button
              type="button"
              onClick={() => {
                setDraftRemoved(true)
                setDraftFile(null)
              }}
              className="flex-1 py-2 px-4 bg-warning-light hover:bg-warning-light-hover text-warning font-medium rounded-lg transition-colors text-sm"
            >
              Remove Image
            </button>
          )}
        </div>

        {/* Aspect Ratio */}
        <div>
          <label
            htmlFor={`aspect-ratio-${editingImageId}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Aspect Ratio
          </label>
          <select
            id={`aspect-ratio-${editingImageId}`}
            value={draftRatio}
            onChange={(e) => setDraftRatio(e.target.value as AspectRatio | "")}
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none"
          >
            {ASPECT_RATIO_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  )
}
