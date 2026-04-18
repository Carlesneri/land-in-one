"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Modal } from "@/app/ui/Modal"
import { AddElementButton } from "@/app/components/AddElementButton"
import { HeadlineElement } from "@/app/components/builder/HeadlineElement"
import { TextElement } from "@/app/components/builder/TextElement"
import { ImageElement } from "@/app/components/builder/ImageElement"
import { ElementCard } from "@/app/components/builder/ElementCard"
import {
  publishPage,
  savePreviewPage,
  unpublishPage,
  isSlugPublished,
} from "@/app/actions/pages"
import {
  createPresignedUrl,
  deleteImageInCloud,
} from "@/app/actions/cloud-storage"
import { toast } from "sonner"
import type { LandingPage, LandingPageElement } from "@/types"
import { MAX_IMAGE_SIZE_MB, S3_BASE_URL } from "@/CONSTANTS"
import axios, { type AxiosProgressEvent } from "axios"
import { RichTextEditor } from "@/app/components/builder/RichTextEditor"

export function AppBuilder({
  elements: initialElements,
  slug,
  id,
}: {
  elements: LandingPageElement[]
  slug: LandingPage["slug"]
  id: string
}) {
  const [elements, setElements] =
    useState<LandingPageElement[]>(initialElements)
  const [pageId] = useState<string>(id)
  const [draggedElement, setDraggedElement] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalPosition, setModalPosition] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteElementId, setDeleteElementId] = useState<string | null>(null)
  const [editingElementId, setEditingElementId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState<string>("")
  const [editingImageId, setEditingImageId] = useState<string | null>(null)
  const [dragOverPosition, setDragOverPosition] = useState<number | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [pageSlug, setPageSlug] = useState<string>(slug)
  const [showSlugModal, setShowSlugModal] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [isUnpublishing, setIsUnpublishing] = useState(false)
  const [optionsElementId, setOptionsElementId] = useState<string | null>(null)
  const [progressModal, setProgressModal] = useState<{
    isOpen: boolean
    progress: number
  }>({
    isOpen: false,
    progress: 0,
  })
  const imageInputRefs = useRef<Record<number, HTMLInputElement | null>>({})

  // Auto-save elements to Preview Page model when they change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pageSlug && pageId) {
        savePreviewPage(pageId, {
          slug: pageSlug,
          elements,
        }).catch(() => {
          toast.error("Page could not be saved.")
        })
      }
    }, 300) // time debounce

    return () => clearTimeout(timer)
  }, [elements, pageSlug, pageId])

  // Check if page is published
  useEffect(() => {
    if (pageSlug) {
      isSlugPublished(pageSlug).then(setIsPublished)
    }
  }, [pageSlug])

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedElement(String(index))
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDragOverPosition = (e: React.DragEvent, position: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverPosition(position)
  }

  const handleDropOnElement = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()

    if (!draggedElement) {
      setDraggedElement(null)
      setDragOverPosition(null)
      return
    }

    const draggedIndex = parseInt(draggedElement, 10)
    if (draggedIndex === -1 || draggedIndex === targetIndex) {
      setDraggedElement(null)
      setDragOverPosition(null)
      return
    }

    const newElements = [...elements]
    ;[newElements[draggedIndex], newElements[targetIndex]] = [
      newElements[targetIndex],
      newElements[draggedIndex],
    ]

    setElements(newElements)
    setDraggedElement(null)
    setDragOverPosition(null)
  }

  const handleDropOnPosition = (e: React.DragEvent, position: number) => {
    e.preventDefault()

    if (!draggedElement) {
      setDraggedElement(null)
      setDragOverPosition(null)
      return
    }

    const draggedIndex = parseInt(draggedElement, 10)
    if (draggedIndex === -1) {
      setDraggedElement(null)
      setDragOverPosition(null)
      return
    }

    const newElements = [...elements]
    const draggedEl = newElements[draggedIndex]
    newElements.splice(draggedIndex, 1)
    newElements.splice(position, 0, draggedEl)
    // Update positions
    newElements.forEach((el, idx) => {
      el.position = idx
    })

    setElements(newElements)
    setDraggedElement(null)
    setDragOverPosition(null)
  }

  const handleDragEnd = () => {
    setDraggedElement(null)
  }

  const handleAddElement = (type: "text" | "image" | "headline") => {
    if (
      type === "image" &&
      elements.filter((el) => el.type === "image").length >= 10
    ) {
      setShowModal(false)
      setModalPosition(null)
      toast.error("You can only add up to 10 image elements per page")
      return
    }

    const newElement = {
      type,
      content: "",
      position: modalPosition ?? elements.length,
      ...(type === "headline" && {
        headlineLevel: elements.some(
          (el) => el.type === "headline" && (el.headlineLevel ?? 1) === 1,
        )
          ? 2
          : 1,
      }),
    } as LandingPage["elements"][0]

    const newElements = [...elements]
    if (modalPosition !== null) {
      newElements.splice(modalPosition, 0, newElement)
      // Update positions after insertion
      newElements.forEach((el, idx) => {
        el.position = idx
      })
    } else {
      newElement.position = newElements.length
      newElements.push(newElement)
    }

    setElements(newElements)
    setShowModal(false)
    setModalPosition(null)
  }

  const handleDeleteElement = (index: number) => {
    setDeleteElementId(String(index))
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (deleteElementId !== null) {
      const index = parseInt(deleteElementId, 10)
      const element = elements[index]

      // Delete image from cloud if element is an image with content
      if (element?.type === "image" && element?.content) {
        deleteImageInCloud(element.content).catch(() => {
          // Silent failure for cleanup
        })
      }

      const newElements = elements.filter((_, idx) => idx !== index)
      // Update positions
      newElements.forEach((el, idx) => {
        el.position = idx
      })
      setElements(newElements)
      setShowDeleteModal(false)
      setDeleteElementId(null)
      toast.success("Element deleted")
    }
  }

  const handleUpdateContent = (index: number, content: string) => {
    setElements(
      elements.map((el, idx) => (idx === index ? { ...el, content } : el)),
    )
  }

  const handleUpdateHeadlineLevel = (
    index: number,
    level: NonNullable<LandingPageElement["headlineLevel"]>,
  ) => {
    setElements(
      elements.map((el, idx) =>
        idx === index ? { ...el, headlineLevel: level } : el,
      ),
    )
  }

  const handleUpdateAspectRatio = (
    index: number,
    ratio: LandingPageElement["aspectRatio"],
  ) => {
    setElements(
      elements.map((el, idx) =>
        idx === index ? { ...el, aspectRatio: ratio } : el,
      ),
    )
  }

  const handleImageSelect = (index: number, file: File) => {
    // Validate file size
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error(`Image size exceeds ${MAX_IMAGE_SIZE_MB}MB limit`)
      return
    }

    // Get the current image URL to delete it from cloud
    const currentImageUrl = elements[index]?.content

    // Upload image to cloud immediately
    uploadImageToCloud(file)
      .then((imageUrl) => {
        // Delete previous image from cloud if it exists
        if (currentImageUrl) {
          deleteImageInCloud(currentImageUrl).catch(() => {
            // Silent failure for cleanup
          })
        }
        // Update element with cloud URL
        handleUpdateContent(index, imageUrl)
        toast.success("Image uploaded")
      })
      .catch(() => {
        toast.error("Failed to upload image")
      })
  }

  const openEditModal = (element: LandingPageElement, index: number) => {
    if (element.type !== "image") {
      setEditingElementId(String(index))

      if (element.content) {
        setEditingContent(element.content)
      }
    }
  }

  const closeEditModal = () => {
    setEditingElementId(null)
    setEditingContent("")
  }

  const saveEditingContent = () => {
    if (editingElementId !== null) {
      const index = parseInt(editingElementId, 10)
      handleUpdateContent(index, editingContent)
      closeEditModal()
    }
  }

  const closeImageEditModal = () => {
    setEditingImageId(null)
  }

  const handleRemoveImage = () => {
    if (editingImageId !== null) {
      const index = parseInt(editingImageId, 10)
      const imageUrl = elements[index]?.content

      // Delete image from cloud if it exists
      if (imageUrl) {
        deleteImageInCloud(imageUrl).catch(() => {
          // Silent failure for cleanup
        })
      }

      handleUpdateContent(index, "")
      closeImageEditModal()
      toast.success("Image removed")
    }
  }

  const uploadImageToCloud = async (file: File): Promise<string> => {
    try {
      // Get presigned URL from server
      const { url: presignedUrl, imageKey } = await createPresignedUrl({
        ContentType: file.type,
      })

      await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1),
          )
          setProgressModal({
            isOpen: true,
            progress,
          })
        },
      })

      // Construct the image URL from the key
      const imageUrl = `${S3_BASE_URL}/${imageKey}`

      // Close progress modal after successful upload
      setProgressModal({ isOpen: false, progress: 0 })

      return imageUrl
    } catch {
      // Close progress modal on error
      setProgressModal({ isOpen: false, progress: 0 })
      throw new Error("Failed to upload image")
    }
  }

  const handlePublishPage = async () => {
    if (!pageSlug.trim()) {
      setShowSlugModal(true)
      return
    }

    setIsPublishing(true)

    try {
      // Elements already have cloud URLs, just publish them
      const result = await publishPage(pageId, {
        slug: pageSlug,
        elements,
      })

      if (result?.success) {
        toast.success("Page published successfully")
        setIsPublished(true)
      } else if (result) {
        toast.error("An error occurred")
      }
    } catch {
      toast.error("Failed to publish page")
    } finally {
      setIsPublishing(false)
    }
  }

  const handleUnpublishPage = async () => {
    setIsUnpublishing(true)
    try {
      const result = await unpublishPage(pageSlug)
      if (result?.success) {
        toast.success("Page unpublished successfully")
        setIsPublished(false)
      } else {
        toast.error(result?.error || "Failed to unpublish page")
      }
    } catch {
      toast.error("Failed to unpublish page")
    } finally {
      setIsUnpublishing(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Main Content Area */}
      <section className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">
              {pageSlug}
            </h1>
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handlePublishPage()}
                  disabled={isPublishing}
                  className="px-4 sm:px-6 py-2 bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]"
                >
                  {isPublishing ? "Publishing..." : "Publish Page"}
                </button>
                {isPublished && (
                  <button
                    type="button"
                    onClick={() => handleUnpublishPage()}
                    disabled={isUnpublishing}
                    className="px-4 sm:px-6 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    {isUnpublishing ? "Unpublishing..." : "Unpublish"}
                  </button>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 text-xs sm:text-sm">
                <Link
                  href={`/preview/${pageSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#EDE9FB] hover:bg-[#C8B3FD] text-[#6442D6] font-medium rounded-lg transition-colors text-center"
                >
                  View Preview
                </Link>
                <Link
                  href={`/${pageSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#16A34A] font-medium rounded-lg transition-colors text-center"
                >
                  View Published
                </Link>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="mt-8 space-y-6">
            {/* Add button at start */}
            <AddElementButton
              position={0}
              dragOverPosition={dragOverPosition}
              onDragOver={handleDragOverPosition}
              onDragLeave={() => setDragOverPosition(null)}
              onDrop={handleDropOnPosition}
              onClick={(pos) => {
                setModalPosition(pos)
                setShowModal(true)
              }}
            />

            {elements.map((element, index) => (
              <div key={`${element.type}-${element.position}`}>
                <ElementCard
                  element={element}
                  index={index}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDropOnElement}
                  onDragEnd={handleDragEnd}
                  onDelete={handleDeleteElement}
                  onOpenOptions={(i) => setOptionsElementId(String(i))}
                >
                  {element.type === "headline" && (
                    <HeadlineElement
                      element={element}
                      index={index}
                      onEdit={openEditModal}
                    />
                  )}
                  {element.type === "text" && (
                    <TextElement
                      element={element}
                      index={index}
                      onEdit={openEditModal}
                    />
                  )}
                  {element.type === "image" && (
                    <ImageElement
                      element={element}
                      index={index}
                      imageInputRef={(el) => {
                        if (el) imageInputRefs.current[index] = el
                      }}
                      onOpenEditModal={(i) => setEditingImageId(String(i))}
                      onFileChange={handleImageSelect}
                    />
                  )}
                </ElementCard>

                {/* Add button after element */}
                <AddElementButton
                  position={index + 1}
                  dragOverPosition={dragOverPosition}
                  onDragOver={handleDragOverPosition}
                  onDragLeave={() => setDragOverPosition(null)}
                  onDrop={handleDropOnPosition}
                  onClick={(pos) => {
                    setModalPosition(pos)
                    setShowModal(true)
                  }}
                  className="mt-2"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add Element Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setModalPosition(null)
        }}
        title="Add Element"
      >
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleAddElement("headline")}
            className="w-full p-3 sm:p-4 text-left border-2 border-slate-200 rounded-lg hover:border-[#6442D6] hover:bg-[#F5F2FF] transition-all flex items-center gap-3"
          >
            <span className="text-xl sm:text-2xl">📰</span>
            <span className="font-semibold text-[#111827] text-sm sm:text-base">
              Headline
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleAddElement("text")}
            className="w-full p-3 sm:p-4 text-left border-2 border-slate-200 rounded-lg hover:border-[#6442D6] hover:bg-[#F5F2FF] transition-all flex items-center gap-3"
          >
            <span className="text-xl sm:text-2xl">📝</span>
            <span className="font-semibold text-[#111827] text-sm sm:text-base">
              Text
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleAddElement("image")}
            className="w-full p-3 sm:p-4 text-left border-2 border-slate-200 rounded-lg hover:border-[#6442D6] hover:bg-[#F5F2FF] transition-all flex items-center gap-3"
          >
            <span className="text-xl sm:text-2xl">🖼️</span>
            <span className="font-semibold text-[#111827] text-sm sm:text-base">
              Image
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowModal(false)
            setModalPosition(null)
          }}
          className="w-full mt-6 py-2 text-gray-600 hover:text-gray-900 border-t border-gray-200 pt-6 font-medium text-sm sm:text-base"
        >
          Cancel
        </button>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeleteElementId(null)
        }}
        title="Remove Element"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to remove this element? This action cannot be
          undone.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setShowDeleteModal(false)
              setDeleteElementId(null)
            }}
            className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
          >
            Remove
          </button>
        </div>
      </Modal>

      {/* Edit Content Modal */}
      <Modal
        isOpen={!!editingElementId}
        onClose={closeEditModal}
        title="Edit Content"
        size="large"
      >
        <div className="space-y-4">
          {editingElementId !== null &&
          elements[parseInt(editingElementId, 10)]?.type === "text" ? (
            <RichTextEditor
              content={editingContent}
              onChange={setEditingContent}
            />
          ) : (
            <textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              placeholder="Enter your content here..."
              className="w-full h-32 p-3 border-2 border-slate-200 rounded-lg focus:border-[#6442D6] focus:outline-none resize-none"
            />
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={closeEditModal}
              className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-[#111827] font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveEditingContent}
              className="flex-1 py-2 px-4 bg-[#6442D6] hover:bg-[#5234C0] text-white font-medium rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Image Modal */}
      <Modal
        isOpen={!!editingImageId}
        onClose={closeImageEditModal}
        title="Edit Image"
      >
        <div className="space-y-3">
          <label
            htmlFor={`image-input-modal-${editingImageId}`}
            className="block w-full py-2 px-4 bg-[#6442D6] hover:bg-[#5234C0] text-white font-medium rounded-lg cursor-pointer transition-colors text-center"
          >
            Change Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id={`image-input-modal-${editingImageId}`}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file && editingImageId !== null) {
                const index = parseInt(editingImageId, 10)
                handleImageSelect(index, file)
                closeImageEditModal()
              }
            }}
          />

          {editingImageId !== null &&
            elements[parseInt(editingImageId, 10)]?.content && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="w-full py-2 px-4 bg-[#FEF3C7] hover:bg-[#FCD34D] text-[#D97706] font-medium rounded-lg transition-colors"
              >
                Remove Image
              </button>
            )}

          <button
            type="button"
            onClick={closeImageEditModal}
            className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Page Slug Modal */}
      <Modal
        isOpen={showSlugModal}
        onClose={() => setShowSlugModal(false)}
        title="Enter Page Slug"
      >
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Enter a unique slug for your page (lowercase, hyphens allowed)
          </p>
          <input
            type="text"
            value={pageSlug}
            onChange={(e) =>
              setPageSlug(
                e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
              )
            }
            placeholder="my-page-name"
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-[#6442D6] focus:outline-none"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowSlugModal(false)}
              className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-[#111827] font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (pageSlug.trim()) {
                  setShowSlugModal(false)
                }
              }}
              className="flex-1 py-2 px-4 bg-[#6442D6] hover:bg-[#5234C0] text-white font-medium rounded-lg transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      {/* Upload Progress Modal */}
      <Modal
        isOpen={progressModal.isOpen}
        onClose={() => {}}
        title="Uploading Image"
      >
        <div className="space-y-4">
          <div className="w-full bg-slate-100 rounded-lg h-2 overflow-hidden">
            <div
              className="bg-[#6442D6] h-full transition-all duration-300"
              style={{ width: `${progressModal.progress}%` }}
            />
          </div>
          <p className="text-center text-gray-600 font-medium">
            {progressModal.progress}%
          </p>
        </div>
      </Modal>

      {/* Element Options Modal */}
      <Modal
        isOpen={!!optionsElementId}
        onClose={() => setOptionsElementId(null)}
        title="Element Options"
      >
        <div className="space-y-4">
          {optionsElementId !== null &&
            elements[parseInt(optionsElementId, 10)]?.type === "headline" && (
              <div>
                <label
                  htmlFor="options-headline-level-select"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Headline Level
                </label>
                <select
                  id="options-headline-level-select"
                  value={
                    elements[parseInt(optionsElementId, 10)]?.headlineLevel ?? 1
                  }
                  onChange={(e) => {
                    const index = parseInt(optionsElementId, 10)
                    handleUpdateHeadlineLevel(
                      index,
                      Number(e.target.value) as NonNullable<
                        LandingPageElement["headlineLevel"]
                      >,
                    )
                  }}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-[#6442D6] focus:outline-none"
                >
                  {([1, 2, 3, 4, 5, 6] as const).map((lvl) => (
                    <option key={lvl} value={lvl}>
                      H{lvl}
                    </option>
                  ))}
                </select>
              </div>
            )}

          {optionsElementId !== null &&
            elements[parseInt(optionsElementId, 10)]?.type === "image" && (
              <div>
                <label
                  htmlFor="options-aspect-ratio-select"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Aspect Ratio
                </label>
                <select
                  id="options-aspect-ratio-select"
                  value={
                    elements[parseInt(optionsElementId, 10)]?.aspectRatio ?? ""
                  }
                  onChange={(e) => {
                    const index = parseInt(optionsElementId, 10)
                    handleUpdateAspectRatio(
                      index,
                      (e.target.value as NonNullable<
                        LandingPageElement["aspectRatio"]
                      >) || undefined,
                    )
                  }}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-[#6442D6] focus:outline-none"
                >
                  <option value="">Original (no crop)</option>
                  <option value="16/9">16:9 (Landscape)</option>
                  <option value="4/3">4:3</option>
                  <option value="1/1">1:1 (Square)</option>
                  <option value="3/4">3:4 (Portrait)</option>
                  <option value="9/16">9:16 (Portrait)</option>
                </select>
              </div>
            )}

          <button
            type="button"
            onClick={() => setOptionsElementId(null)}
            className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-[#111827] font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  )
}
