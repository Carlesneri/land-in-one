"use client"

import { useState } from "react"
import Image from "next/image"
import { IconPhoto } from "@tabler/icons-react"
import type { ImageElement as ImageElementType } from "@/types"
import type { AspectRatio } from "@/types"
import { EditImageModal } from "@/app/components/modals/EditImageModal"
import { ElementCard } from "@/app/components/builder/ElementCard"

interface ImageElementProps {
  element: ImageElementType
  index: number
  onFileChange: (file: File) => void
  onRemove: () => void
  onDelete: (index: number) => void
  onAspectRatioChange: (ratio: AspectRatio | undefined) => void
}

export function ImageElement({
  element,
  index,
  onFileChange,
  onRemove,
  onDelete,
  onAspectRatioChange,
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
        onSelectFile={(file) => onFileChange(file)}
        onRemove={() => onRemove()}
        onSave={(ratio) => onAspectRatioChange(ratio)}
      />
    </ElementCard>
  )
}
