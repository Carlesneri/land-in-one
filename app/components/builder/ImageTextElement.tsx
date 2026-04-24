"use client"

import Image from "next/image"
import { IconPhoto } from "@tabler/icons-react"
import type { ImageTextElement as ImageTextElementType } from "@/types"

interface ImageTextElementProps {
  element: ImageTextElementType
  index: number
  imageInputRef: (el: HTMLInputElement | null) => void
  onOpenEditModal: (index: number) => void
  onOpenTextModal: (element: ImageTextElementType, index: number) => void
  onFileChange: (index: number, file: File) => void
}

export function ImageTextElement({
  element,
  index,
  imageInputRef,
  onOpenEditModal,
  onOpenTextModal,
  onFileChange,
}: ImageTextElementProps) {
  return (
    <>
      <div className="relative w-full rounded overflow-hidden">
        {element.image ? (
          <>
            {/* Image */}
            <button
              type="button"
              onClick={() => onOpenEditModal(index)}
              className="w-full block cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Edit image"
            >
              <Image
                src={element.image}
                alt="Element content"
                width={800}
                height={400}
                className="w-full object-cover rounded"
              />
            </button>

            {/* Overlay text */}
            <button
              type="button"
              onClick={() => onOpenTextModal(element, index)}
              className="absolute inset-0 flex items-center justify-center p-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
              aria-label="Edit overlay text"
            >
              {element.text ? (
                <>
                  {/* Radial gradient scrim for readability */}
                  <span
                    className="absolute inset-0 pointer-events-none rounded"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent, rgba(0,0,0,0.6) 50%, transparent)",
                    }}
                    aria-hidden="true"
                  />
                  <div
                    className="relative text-white text-center drop-shadow-lg pointer-events-none prose prose-sm prose-invert max-w-none"
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
            onClick={() => {
              const input = document.getElementById(
                `image-text-input-${index}`,
              ) as HTMLInputElement | null
              input?.click()
            }}
            className="w-full h-32 sm:h-40 rounded flex items-center justify-center cursor-pointer hover:bg-primary-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Select image"
          >
            <div className="text-center">
              <IconPhoto
                size={40}
                className="text-secondary mx-auto mb-2"
                aria-hidden="true"
              />
              <p className="text-gray-600 text-sm sm:text-base">
                Click to select image
              </p>
            </div>
          </button>
        )}
      </div>

      <input
        id={`image-text-input-${index}`}
        type="file"
        accept="image/*"
        className="hidden"
        ref={imageInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFileChange(index, file)
        }}
      />
    </>
  )
}
