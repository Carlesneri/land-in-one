"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  checkSlugAvailable,
  deleteLandingPage,
} from "@/app/actions/pages"
import {
  createPresignedUrl,
  deleteImageInCloud,
} from "@/app/actions/cloud-storage"
import { toast } from "sonner"
import type { LandingPage, LandingPageElement } from "@/types"
import { MAX_IMAGE_SIZE_MB, S3_BASE_URL } from "@/CONSTANTS"
import axios, { type AxiosProgressEvent } from "axios"
import { Button } from "@/app/ui/Button"
import {
  IconExternalLink,
  IconPencil,
  IconTrash,
  IconArrowLeft,
} from "@tabler/icons-react"
import { RichTextEditor } from "@/app/components/builder/RichTextEditor"
import { useIsStandalone } from "@/app/hooks/useIsStandalone"
import { validateSlug } from "@/lib/validation/slug"

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

  const [isPublished, setIsPublished] = useState(false)
  const [isUnpublishing, setIsUnpublishing] = useState(false)
  const [optionsElementId, setOptionsElementId] = useState<string | null>(null)
  const [showChangeSlugModal, setShowChangeSlugModal] = useState(false)
  const [newSlugInput, setNewSlugInput] = useState("")
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [isCheckingSlug, setIsCheckingSlug] = useState(false)
  const [slugValidationError, setSlugValidationError] = useState<string | null>(
    null,
  )
  const [progressModal, setProgressModal] = useState<{
    isOpen: boolean
    progress: number
  }>({
    isOpen: false,
    progress: 0,
  })
  const imageInputRefs = useRef<Record<number, HTMLInputElement | null>>({})
  const isStandalone = useIsStandalone()
  const router = useRouter()
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false)
  const [isDeletingProject, setIsDeletingProject] = useState(false)

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

  // Debounced slug availability check
  useEffect(() => {
    if (!showChangeSlugModal) return
    const trimmed = newSlugInput.trim()

    if (!trimmed || trimmed === pageSlug) {
      setSlugAvailable(null)
      setSlugValidationError(null)
      return
    }

    // Client-side validation first (instant)
    const validation = validateSlug(trimmed)
    if (!validation.valid) {
      setSlugValidationError(validation.error)
      setSlugAvailable(null)
      setIsCheckingSlug(false)
      return
    }

    setSlugValidationError(null)
    setIsCheckingSlug(true)
    const timer = setTimeout(() => {
      checkSlugAvailable(trimmed, pageId).then(({ available }) => {
        setSlugAvailable(available)
        setIsCheckingSlug(false)
      })
    }, 400)
    return () => clearTimeout(timer)
  }, [newSlugInput, showChangeSlugModal, pageSlug, pageId])

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
      setNewSlugInput("")
      setSlugAvailable(null)
      setSlugValidationError(null)
      setShowChangeSlugModal(true)
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

  const handleSaveSlug = () => {
    const trimmed = newSlugInput.trim()
    if (!trimmed || slugAvailable === false || slugValidationError) return
    setPageSlug(trimmed)
    setShowChangeSlugModal(false)
    setNewSlugInput("")
    setSlugAvailable(null)
    setSlugValidationError(null)
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

  const handleDeleteProject = async () => {
    setIsDeletingProject(true)
    try {
      await deleteLandingPage(pageId)
      toast.success("Project deleted")
      router.push("/dashboard")
    } catch {
      toast.error("Failed to delete project")
      setIsDeletingProject(false)
    }
  }

  return (
    <>
      {/* Main Content Area */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Back to Dashboard */}
        <div className="mb-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-base font-bold text-slate-500 hover:text-slate-800 transition-colors underline"
          >
            <IconArrowLeft size={16} aria-hidden="true" />
            All you landings
          </Link>
        </div>

        {/* Landing Settings */}
        <div className="bg-linear-to-b from-primary/80 to-primary-hover/70 rounded-xl shadow-md p-4 sm:p-5 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Slug + pencil */}
            <div className="flex items-center gap-1.5 w-full justify-between">
              <h1 className="text-base font-semibold text-white truncate drop-shadow">
                {pageSlug}
              </h1>
              <button
                type="button"
                onClick={() => {
                  setNewSlugInput(pageSlug)
                  setSlugAvailable(null)
                  setShowChangeSlugModal(true)
                }}
                className="shrink-0 p-1.5 rounded-md text-white bg-white/20 hover:bg-white/35 border border-white/30 transition-colors"
                title="Change slug"
              >
                <IconPencil size={14} aria-hidden="true" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handlePublishPage()}
                disabled={isPublishing}
                className="flex items-center px-4 py-1.5 bg-white hover:bg-white/90 disabled:opacity-60 text-primary font-semibold rounded-lg transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {isPublishing ? "Publishing…" : "Publish"}
              </button>
              {isPublished && (
                <button
                  type="button"
                  onClick={() => handleUnpublishPage()}
                  disabled={isUnpublishing}
                  className="flex items-center px-4 py-1.5 bg-white/20 hover:bg-white/30 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm border border-white/30"
                >
                  {isUnpublishing ? "Unpublishing…" : "Unpublish"}
                </button>
              )}
              <div className="w-px h-5 bg-white/30 hidden sm:block" />
              <Link
                href={`/preview/${pageSlug}`}
                target={isStandalone ? "_self" : "_blank"}
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white font-medium rounded-lg transition-colors text-sm border border-white/20"
              >
                Preview
                <IconExternalLink size={13} aria-hidden="true" />
              </Link>
              {isPublished && (
                <Link
                  href={`/${pageSlug}`}
                  target={isStandalone ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  Published
                  <IconExternalLink size={13} aria-hidden="true" />
                </Link>
              )}
              <div className="w-px h-5 bg-white/30 hidden sm:block" />
              <Button
                variant="danger"
                size="sm"
                disabled={isDeletingProject}
                onClick={() => setShowDeleteProjectModal(true)}
                className="flex items-center gap-1.5"
              >
                <IconTrash size={14} aria-hidden="true" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8">
          {/* Preview Area */}
          <div className="space-y-6">
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
            className="w-full p-3 sm:p-4 text-left border-2 border-slate-200 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3"
          >
            <span className="text-xl sm:text-2xl">📰</span>
            <span className="font-semibold text-text text-sm sm:text-base">
              Headline
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleAddElement("text")}
            className="w-full p-3 sm:p-4 text-left border-2 border-slate-200 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3"
          >
            <span className="text-xl sm:text-2xl">📝</span>
            <span className="font-semibold text-text text-sm sm:text-base">
              Text
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleAddElement("image")}
            className="w-full p-3 sm:p-4 text-left border-2 border-slate-200 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3"
          >
            <span className="text-xl sm:text-2xl">🖼️</span>
            <span className="font-semibold text-text text-sm sm:text-base">
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
              // biome-ignore lint/a11y/noAutofocus: intentional focus when edit modal opens
              autoFocus
              className="w-full h-32 p-3 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none resize-none"
            />
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={closeEditModal}
              className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-text font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveEditingContent}
              className="flex-1 py-2 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
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
            className="block w-full py-2 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg cursor-pointer transition-colors text-center"
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
                className="w-full py-2 px-4 bg-warning-light hover:bg-warning-light-hover text-warning font-medium rounded-lg transition-colors"
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

      <Modal
        isOpen={showChangeSlugModal}
        onClose={() => {
          setShowChangeSlugModal(false)
          setNewSlugInput("")
          setSlugAvailable(null)
          setSlugValidationError(null)
        }}
        title="Change Slug"
      >
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Enter a new slug for your page (lowercase letters, numbers and
            hyphens only).
          </p>
          <div className="space-y-1">
            <input
              type="text"
              value={newSlugInput}
              onChange={(e) =>
                setNewSlugInput(
                  e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                )
              }
              placeholder="my-page-slug"
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                slugValidationError || slugAvailable === false
                  ? "border-red-400 focus:border-red-500"
                  : slugAvailable === true
                    ? "border-green-400 focus:border-green-500"
                    : "border-slate-200 focus:border-primary"
              }`}
            />
            <p className="text-xs h-4">
              {isCheckingSlug && (
                <span className="text-slate-400">Checking availability…</span>
              )}
              {!isCheckingSlug && slugValidationError && (
                <span className="text-red-500">{slugValidationError}</span>
              )}
              {!isCheckingSlug &&
                !slugValidationError &&
                slugAvailable === false && (
                  <span className="text-red-500">
                    This slug is already taken.
                  </span>
                )}
              {!isCheckingSlug &&
                !slugValidationError &&
                slugAvailable === true && (
                  <span className="text-green-600">Slug is available!</span>
                )}
              {!isCheckingSlug &&
                !slugValidationError &&
                newSlugInput.trim() === pageSlug &&
                newSlugInput.trim() !== "" && (
                  <span className="text-slate-400">
                    This is the current slug.
                  </span>
                )}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setShowChangeSlugModal(false)
                setNewSlugInput("")
                setSlugAvailable(null)
                setSlugValidationError(null)
              }}
              className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-text font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveSlug}
              disabled={
                !newSlugInput.trim() ||
                newSlugInput.trim() === pageSlug ||
                !!slugValidationError ||
                slugAvailable === false ||
                isCheckingSlug
              }
              className="flex-1 py-2 px-4 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Save
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
              className="bg-primary h-full transition-all duration-300"
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
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none"
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
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none"
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
            className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-text font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>
      {/* Delete Project Confirmation Modal */}
      <Modal
        isOpen={showDeleteProjectModal}
        onClose={() => setShowDeleteProjectModal(false)}
        title="Delete Project"
      >
        <p className="text-gray-600 mb-2">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-text">{pageSlug}</span>? This
          action cannot be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => setShowDeleteProjectModal(false)}
            className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-text font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteProject}
            disabled={isDeletingProject}
            className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-medium rounded-lg transition-colors"
          >
            {isDeletingProject ? "Deleting…" : "Delete Project"}
          </button>
        </div>
      </Modal>
    </>
  )
}
