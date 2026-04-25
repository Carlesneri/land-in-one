"use client"

import { useState } from "react"
import Image from "next/image"
import { IconPhoto } from "@tabler/icons-react"
import type { ImageTextElement as ImageTextElementType } from "@/types"
import type { AspectRatio } from "@/types"
import { EditImageTextModal } from "@/app/components/modals/EditImageTextModal"
import { ElementCard } from "@/app/components/builder/ElementCard"

interface ImageTextElementProps {
  element: ImageTextElementType
  index: number
  onFileChange: (file: File) => void
  onImageRemove: () => void
  onSave: (image: string, text: string) => void
  onDelete: (index: number) => void
  onAspectRatioChange: (ratio: AspectRatio | undefined) => void
  onTextPositionChange: (position: "top" | "center" | "bottom") => void
}

export function ImageTextElement({
  element,
  index,
  onFileChange,
  onImageRemove,
  onSave,
  onDelete,
  onAspectRatioChange,
  onTextPositionChange,
}: ImageTextElementProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [draft, setDraft] = useState({
    image: element.image,
    text: element.text,
  })

  const open = () => {
    setDraft({ image: element.image, text: element.text })
    setModalOpen(true)
  }

  const close = () => setModalOpen(false)

  const save = () => {
    onSave(draft.image, draft.text)
    close()
  }

  return (
    <ElementCard element={element} index={index} onDelete={onDelete}>
      <div className="relative w-full rounded overflow-hidden">
        {element.image ? (
          <>
            {/* Image — click opens modal */}
            <button
              type="button"
              onClick={open}
              className="w-full block cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Edit image and text"
            >
              <Image
                src={element.image}
                alt="Element content"
                width={800}
                height={400}
                className="w-full object-cover rounded"
              />
            </button>

            {/* Overlay text — click also opens modal */}
            <button
              type="button"
              onClick={open}
              className={`absolute inset-0 flex justify-center p-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded ${
                element.textPosition === "top"
                  ? "items-start"
                  : element.textPosition === "bottom"
                    ? "items-end"
                    : "items-center"
              }`}
              aria-label="Edit overlay text"
            >
              {element.text ? (
                <>
                  {/* Linear gradient scrim for readability */}
                  <span
                    className="absolute inset-0 pointer-events-none rounded"
                    style={{
                      background:
                        element.textPosition === "top"
                          ? "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 60%)"
                          : element.textPosition === "bottom"
                            ? "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)"
                            : "linear-gradient(to bottom, transparent, rgba(0,0,0,0.6) 50%, transparent)",
                    }}
                    aria-hidden="true"
                  />
                  <div
                    className="rich-text-lio relative text-white text-center drop-shadow-lg pointer-events-none prose prose-sm prose-invert max-w-none"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: content is user-authored rich text from Tiptap
                    dangerouslySetInnerHTML={{ __html: element.text }}
                  />
                </>
              ) : (
                <span className="text-white/70 text-sm border border-white/40 rounded px-3 py-1.5 bg-black/20 backdrop-blur-sm">
                  Click to add overlay text
                </span>
              )}
            </button>
          </>
        ) : (
          /* Empty state — no image yet */
          <button
            type="button"
            onClick={open}
            className="w-full h-32 sm:h-40 rounded flex items-center justify-center cursor-pointer hover:bg-primary-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Add image and text"
          >
            <div className="text-center">
              <IconPhoto
                size={40}
                className="text-secondary mx-auto mb-2"
                aria-hidden="true"
              />
              <p className="text-gray-600 text-sm sm:text-base">
                Click to add image & text
              </p>
            </div>
          </button>
        )}
      </div>

      <EditImageTextModal
        isOpen={modalOpen}
        image={draft.image}
        text={draft.text}
        aspectRatio={element.aspectRatio}
        textPosition={element.textPosition}
        onClose={close}
        onImageChange={(file) => {
          onFileChange(file)
          close()
        }}
        onImageRemove={() => {
          onImageRemove()
          setDraft((prev) => ({ ...prev, image: "" }))
        }}
        onTextChange={(text) => setDraft((prev) => ({ ...prev, text }))}
        onAspectRatioChange={onAspectRatioChange}
        onTextPositionChange={onTextPositionChange}
        onSave={save}
      />
    </ElementCard>
  )
}
