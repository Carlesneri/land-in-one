"use client"

import { useState } from "react"
import Image from "next/image"
import { IconPhoto } from "@tabler/icons-react"
import type { ImageElement as ImageElementType } from "@/types"
import type { AspectRatio } from "@/types"
import { EditImageModal } from "@/app/components/modals/EditImageModal"
import { ElementCard } from "@/app/components/builder/ElementCard"

export interface ImageSaveParams {
  aspectRatio: AspectRatio | undefined
  pendingFile?: File
  imageRemoved?: boolean
}

interface ImageElementProps {
  element: ImageElementType
  index: number
  onSave: (params: ImageSaveParams) => void
  onDelete: (index: number) => void
}

export function ImageElement({
  element,
  index,
  onSave,
  onDelete,
}: ImageElementProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <ElementCard element={element} index={index} onDelete={onDelete}>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="w-full rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={element.content ? "Edit image" : "Add image"}
      >
        {element.content ? (
          <Image
            src={element.content}
            alt="Element content"
            width={800}
            height={160}
            className="w-full h-40 object-cover rounded"
          />
        ) : (
          <div className="w-full h-24 sm:h-32 rounded flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200">
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <IconPhoto size={36} aria-hidden="true" />
              <span className="text-sm">No image selected</span>
            </div>
          </div>
        )}
      </button>

      <EditImageModal
        isOpen={modalOpen}
        editingImageId={String(index)}
        imageUrl={element.content || undefined}
        aspectRatio={element.aspectRatio}
        onClose={() => setModalOpen(false)}
        onSelectFile={() => {}} // handled inside modal draft; passed via onSave
        onRemove={() => {}} // handled inside modal draft; passed via onSave
        onSave={(ratio, pendingFile, imageRemoved) => {
          onSave({ aspectRatio: ratio, pendingFile, imageRemoved })
          setModalOpen(false)
        }}
      />
    </ElementCard>
  )
}
