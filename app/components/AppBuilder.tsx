"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Modal } from "@/app/ui/Modal"
import { publishPage, savePreviewPage } from "@/app/actions/pages"
import { createPresignedUrl } from "@/app/actions/cloud-storage"
import type { LandingPage, LandingPageElement } from "@/types"
import { MAX_IMAGE_SIZE_MB, S3_BASE_URL } from "@/CONSTANTS"
import axios, { type AxiosProgressEvent } from "axios"

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
  const [messageModal, setMessageModal] = useState<{
    isOpen: boolean
    type: "success" | "error"
    title: string
    message: string
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  })
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
          // Silent failure for auto-save
        })
      }
    }, 300) // time debounce

    return () => clearTimeout(timer)
  }, [elements, pageSlug, pageId])

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
    const newElement = {
      type,
      content: "",
      position: modalPosition ?? elements.length,
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
      const newElements = elements.filter((_, idx) => idx !== index)
      // Update positions
      newElements.forEach((el, idx) => {
        el.position = idx
      })
      setElements(newElements)
      setShowDeleteModal(false)
      setDeleteElementId(null)
    }
  }

  const handleUpdateContent = (index: number, content: string) => {
    setElements(
      elements.map((el, idx) => (idx === index ? { ...el, content } : el)),
    )
  }

  const handleImageSelect = (index: number, file: File) => {
    // Validate file size
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setMessageModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: `Image size exceeds ${MAX_IMAGE_SIZE_MB}MB limit`,
      })
      return
    }

    // Upload image to cloud immediately
    uploadImageToCloud(file)
      .then((imageUrl) => {
        // Update element with cloud URL
        handleUpdateContent(index, imageUrl)
      })
      .catch(() => {
        // Error is already handled in uploadImageToCloud
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
      handleUpdateContent(index, "")
      closeImageEditModal()
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
        setMessageModal({
          isOpen: true,
          type: "success",
          title: "Success",
          message: result.message || "Page published successfully",
        })
      } else if (result) {
        setMessageModal({
          isOpen: true,
          type: "error",
          title: "Error",
          message: result.error || "An error occurred",
        })
      }
    } catch {
      // Handle error silently - message modal will show error state
      setMessageModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to publish page",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Main Content Area */}
      <section className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {pageSlug}
            </h1>
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handlePublishPage()}
                  disabled={isPublishing}
                  className="px-4 sm:px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors text-sm sm:text-base"
                >
                  {isPublishing ? "Publishing..." : "Publish Page"}
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 text-xs sm:text-sm">
                <Link
                  href={`/preview/${pageSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg transition-colors text-center"
                >
                  View Preview
                </Link>
                <Link
                  href={`/${pageSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 font-medium rounded-lg transition-colors text-center"
                >
                  View Published
                </Link>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="mt-8 space-y-6">
            {/* Add button at start */}
            <button
              type="button"
              onClick={() => {
                setModalPosition(0)
                setShowModal(true)
              }}
              onDragOver={(e) => handleDragOverPosition(e, 0)}
              onDragLeave={() => setDragOverPosition(null)}
              onDrop={(e) => handleDropOnPosition(e, 0)}
              className={`w-full py-2 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm font-medium transition-colors ${
                dragOverPosition === 0
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400"
              }`}
            >
              <span className="text-lg">+</span>
              Add element
            </button>

            {elements.map((element, index) => (
              <div key={`${element.type}-${element.position}`}>
                {/** biome-ignore lint/a11y/noStaticElementInteractions: to fix forward */}
                <div
                  className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors group relative cursor-move flex items-center justify-between"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnElement(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex-1">
                    {element.type === "headline" && (
                      <button
                        type="button"
                        onClick={() => openEditModal(element, index)}
                        className="w-full text-left text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                        style={{
                          color: element.content ? "#1f2937" : "#d1d5db",
                        }}
                      >
                        {(element.content as string) ||
                          "Click to edit headline"}
                      </button>
                    )}
                    {element.type === "text" && (
                      <button
                        type="button"
                        onClick={() => openEditModal(element, index)}
                        className="w-full text-left leading-relaxed cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                        style={{
                          color: element.content ? "#1f2937" : "#9ca3af",
                        }}
                      >
                        {(element.content as string) || "Click to edit text"}
                      </button>
                    )}
                    {element.type === "image" && (
                      <>
                        {element.content ? (
                          <button
                            type="button"
                            onClick={() => setEditingImageId(String(index))}
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
                              imageInputRefs.current[index]?.click()
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
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={(el) => {
                            if (el) imageInputRefs.current[index] = el
                          }}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleImageSelect(index, file)
                            }
                          }}
                        />
                      </>
                    )}
                  </div>

                  {/* Drag Handle */}
                  <div className="ml-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <title>Drag to reorder element</title>
                      <path d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm4-16h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
                    </svg>
                  </div>
                </div>

                {/* Add button after element */}
                <button
                  type="button"
                  onClick={() => {
                    setModalPosition(index + 1)
                    setShowModal(true)
                  }}
                  onDragOver={(e) => handleDragOverPosition(e, index + 1)}
                  onDragLeave={() => setDragOverPosition(null)}
                  onDrop={(e) => handleDropOnPosition(e, index + 1)}
                  className={`w-full py-2 mt-2 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm font-medium transition-colors ${
                    dragOverPosition === index + 1
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400"
                  }`}
                >
                  <span className="text-lg">+</span>
                  Add element
                </button>
              </div>
            ))}
          </div>

          {elements.length === 0 && (
            <div className="mt-8 p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                No elements added yet. Drag elements from the sidebar to preview
                them.
              </p>
            </div>
          )}
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
            className="w-full p-3 sm:p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-3"
          >
            <span className="text-xl sm:text-2xl">📰</span>
            <span className="font-semibold text-gray-900 text-sm sm:text-base">
              Headline
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleAddElement("text")}
            className="w-full p-3 sm:p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-3"
          >
            <span className="text-xl sm:text-2xl">📝</span>
            <span className="font-semibold text-gray-900 text-sm sm:text-base">
              Text
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleAddElement("image")}
            className="w-full p-3 sm:p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-3"
          >
            <span className="text-xl sm:text-2xl">🖼️</span>
            <span className="font-semibold text-gray-900 text-sm sm:text-base">
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
      >
        <div className="space-y-4">
          <textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            placeholder="Enter your content here..."
            className="w-full h-32 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={closeEditModal}
              className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveEditingContent}
              className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Save
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (editingElementId !== null) {
                const index = parseInt(editingElementId, 10)
                handleDeleteElement(index)
                closeEditModal()
              }
            }}
            className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
          >
            Remove Element
          </button>
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
            className="block w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg cursor-pointer transition-colors text-center"
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
                className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors"
              >
                Remove Image
              </button>
            )}

          <button
            type="button"
            onClick={() => {
              if (editingImageId !== null) {
                const index = parseInt(editingImageId, 10)
                handleDeleteElement(index)
                closeImageEditModal()
              }
            }}
            className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
          >
            Remove Element
          </button>

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
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowSlugModal(false)}
              className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors"
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
              className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      {/* Message Modal */}
      <Modal
        isOpen={messageModal.isOpen}
        onClose={() => setMessageModal({ ...messageModal, isOpen: false })}
        title={messageModal.title}
      >
        <div className="space-y-4">
          <p
            className={
              messageModal.type === "success" ? "text-gray-700" : "text-red-600"
            }
          >
            {messageModal.message}
          </p>
          <button
            type="button"
            onClick={() => setMessageModal({ ...messageModal, isOpen: false })}
            className={`w-full py-2 px-4 font-medium rounded-lg transition-colors text-white ${
              messageModal.type === "success"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Upload Progress Modal */}
      <Modal
        isOpen={progressModal.isOpen}
        onClose={() => {}}
        title="Uploading Image"
      >
        <div className="space-y-4">
          <div className="w-full bg-gray-200 rounded-lg h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-300"
              style={{ width: `${progressModal.progress}%` }}
            />
          </div>
          <p className="text-center text-gray-600 font-medium">
            {progressModal.progress}%
          </p>
        </div>
      </Modal>
    </div>
  )
}
