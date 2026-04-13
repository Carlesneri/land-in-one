"use client"

import Image from "next/image"
import type { LandingPageElement } from "@/types"

interface ImageElementProps {
  element: LandingPageElement
  index: number
  imageInputRef: (el: HTMLInputElement | null) => void
  onOpenEditModal: (index: number) => void
  onFileChange: (index: number, file: File) => void
}

export function ImageElement({
  element,
  index,
  imageInputRef,
  onOpenEditModal,
  onFileChange,
}: ImageElementProps) {
  return (
    <>
      {element.content ? (
        <button
          type="button"
          onClick={() => onOpenEditModal(index)}
          className="w-full h-40 rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Edit image"
        >
          <Image
            src={element.content}
            alt="Element content"
            width={800}
            height={160}
            className="size-full object-cover rounded"
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            const input = document.getElementById(
              `image-input-${index}`,
            ) as HTMLInputElement | null
            input?.click()
          }}
          className="w-full h-24 sm:h-32 bg-gray-200 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Select image"
        >
          <div className="text-center">
            <span className="text-4xl mb-2 block">🖼️</span>
            <p className="text-gray-600 text-sm sm:text-base">
              Click to select image
            </p>
          </div>
        </button>
      )}
      <input
        id={`image-input-${index}`}
        type="file"
        accept="image/*"
        className="hidden"
        ref={imageInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            onFileChange(index, file)
          }
        }}
      />
    </>
  )
}
