"use client"

import { useState } from "react"
import Image from "next/image"
import { IconPhoto } from "@tabler/icons-react"
import type { ImageTextElement as ImageTextElementType } from "@/types"
import { EditImageTextModal } from "@/app/components/modals/EditImageTextModal"
import { buildBackdropCss, type FlatBackdrop } from "@/lib/backdrop"
import { ElementCard } from "@/app/components/builder/ElementCard"

export interface ImageTextSaveParams {
  text: string
  backdropActive: boolean
  flat: FlatBackdrop
  pendingFile?: File // new image selected but not yet uploaded
  imageRemoved?: boolean // user removed the image
}

interface ImageTextElementProps {
  element: ImageTextElementType
  index: number
  onSave: (params: ImageTextSaveParams) => void
  onDelete: (index: number) => void
}

export function ImageTextElement({
  element,
  index,
  onSave,
  onDelete,
}: ImageTextElementProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [draft, setDraft] = useState({
    image: element.image, // shown in modal (may be objectURL)
    pendingFile: null as File | null,
    imageRemoved: false,
    text: element.text,
    backdropActive: element.backdropActive ?? false,
    backdropType: element.backdropType,
    backdropColors: element.backdropColors,
    backdropAngle: element.backdropAngle,
  })

  const open = () => {
    setDraft({
      image: element.image,
      pendingFile: null,
      imageRemoved: false,
      text: element.text,
      backdropActive: element.backdropActive ?? false,
      backdropType: element.backdropType,
      backdropColors: element.backdropColors,
      backdropAngle: element.backdropAngle,
    })
    setModalOpen(true)
  }

  const close = () => setModalOpen(false)

  const save = () => {
    onSave({
      text: draft.text,
      backdropActive: draft.backdropActive,
      flat: {
        backdropType: draft.backdropType,
        backdropColors: draft.backdropColors,
        backdropAngle: draft.backdropAngle,
      },
      pendingFile: draft.pendingFile ?? undefined,
      imageRemoved: draft.imageRemoved,
    })
    close()
  }

  // Build backdrop CSS string for preview — only when active
  const backdropCss =
    element.backdropActive && element.backdropColors?.length
      ? buildBackdropCss({
          backdropType: element.backdropType,
          backdropColors: element.backdropColors,
          backdropAngle: element.backdropAngle,
        })
      : undefined

  return (
    <ElementCard element={element} index={index} onDelete={onDelete}>
      <div className="relative w-full rounded overflow-hidden">
        {element.image ? (
          <button
            type="button"
            onClick={open}
            className="relative w-full rounded overflow-hidden cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Edit image and text"
          >
            {/* Image as absolute background */}
            <Image
              src={element.image}
              alt="Element content"
              width={800}
              height={400}
              className="absolute inset-0 w-full h-full object-cover rounded"
            />
            {/* Backdrop gradient */}
            {backdropCss && (
              <span
                className="absolute inset-0 pointer-events-none rounded"
                style={{ background: backdropCss }}
                aria-hidden="true"
              />
            )}
            {/* Text drives the height */}
            <div className="relative px-4 py-6 flex items-center justify-center">
              {element.text && (
                <div
                  className="rich-text-lio text-center drop-shadow-lg pointer-events-none"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: content is user-authored rich text from Tiptap
                  dangerouslySetInnerHTML={{ __html: element.text }}
                />
              )}
            </div>
            {/* Minimum height when no text */}
            {!element.text && <div className="h-32" />}
          </button>
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
        backdropActive={draft.backdropActive}
        backdropType={draft.backdropType}
        backdropColors={draft.backdropColors}
        backdropAngle={draft.backdropAngle}
        onClose={close}
        onImageChange={(file) => {
          // Preview locally via object URL — upload deferred to save
          const previewUrl = URL.createObjectURL(file)
          setDraft((prev) => ({
            ...prev,
            image: previewUrl,
            pendingFile: file,
            imageRemoved: false,
          }))
        }}
        onImageRemove={() => {
          setDraft((prev) => ({
            ...prev,
            image: "",
            pendingFile: null,
            imageRemoved: true,
          }))
        }}
        onTextChange={(text) => setDraft((prev) => ({ ...prev, text }))}
        onBackdropActiveChange={(active) =>
          setDraft((prev) => ({ ...prev, backdropActive: active }))
        }
        onBackdropChange={(flat) => setDraft((prev) => ({ ...prev, ...flat }))}
        onSave={save}
      />
    </ElementCard>
  )
}
