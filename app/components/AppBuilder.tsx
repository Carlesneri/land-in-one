"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AddElementButton } from "@/app/components/AddElementButton"
import { HeadlineElement } from "@/app/components/builder/HeadlineElement"
import { TextElement } from "@/app/components/builder/TextElement"
import { ImageElement } from "@/app/components/builder/ImageElement"
import { ElementCard } from "@/app/components/builder/ElementCard"
import { AddElementModal } from "@/app/components/modals/AddElementModal"
import { DeleteElementModal } from "@/app/components/modals/DeleteElementModal"
import { EditContentModal } from "@/app/components/modals/EditContentModal"
import { EditImageModal } from "@/app/components/modals/EditImageModal"
import { ChangeSlugModal } from "@/app/components/modals/ChangeSlugModal"
import { ElementOptionsModal } from "@/app/components/modals/ElementOptionsModal"
import { UploadProgressModal } from "@/app/components/modals/UploadProgressModal"
import { DeleteProjectModal } from "@/app/components/modals/DeleteProjectModal"
import { LandingOptionsModal } from "@/app/components/modals/LandingOptionsModal"
import {
  publishPage,
  savePreviewPage,
  unpublishPage,
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
import { Button, buttonVariants } from "@/app/ui/Button"
import {
  IconExternalLink,
  IconPencil,
  IconTrash,
  IconArrowLeft,
  IconSun,
  IconMoon,
} from "@tabler/icons-react"
import { Container } from "@/app/ui/Container"

export function AppBuilder({
  elements: initialElements,
  slug,
  id,
  published,
  mode: initialMode = "light",
}: {
  elements: LandingPageElement[]
  slug: LandingPage["slug"]
  id: string
  published: boolean
  mode?: "light" | "dark"
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

  const [isPublished, setIsPublished] = useState(published)
  const [isUnpublishing, setIsUnpublishing] = useState(false)
  const [optionsElementId, setOptionsElementId] = useState<string | null>(null)
  const [showChangeSlugModal, setShowChangeSlugModal] = useState(false)
  const [progressModal, setProgressModal] = useState<{
    isOpen: boolean
    progress: number
  }>({
    isOpen: false,
    progress: 0,
  })
  const imageInputRefs = useRef<Record<number, HTMLInputElement | null>>({})
  const hasMounted = useRef(false)
  const router = useRouter()
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false)
  const [isDeletingProject, setIsDeletingProject] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const [pageMode, setPageMode] = useState<"light" | "dark">(initialMode)

  // Auto-save elements to Preview Page model when they change
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }
    const timer = setTimeout(() => {
      if (pageSlug && pageId) {
        savePreviewPage(pageId, {
          slug: pageSlug,
          elements,
          mode: pageMode,
        }).catch(() => {
          toast.error("Page could not be saved.")
        })
      }
    }, 300) // time debounce

    return () => clearTimeout(timer)
  }, [elements, pageSlug, pageId, pageMode])

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
    <Container>
      {/* Main Content Area */}
      <section className="">
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
        <div className="bg-linear-to-b from-primary/80 to-primary-hover/70 rounded-xl shadow-md mb-4 overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center justify-between gap-2 px-3 py-2 bg-black/15 border-b border-white/15">
            <span className="text-xs font-medium text-white/60 uppercase tracking-wide">
              Landing page
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setShowOptionsModal(true)}
                className="p-1.5 rounded-md text-white bg-white/20 hover:bg-white/35 border border-white/30 transition-colors"
                title={pageMode === "dark" ? "Dark mode" : "Light mode"}
              >
                {pageMode === "dark" ? (
                  <IconMoon size={14} aria-hidden="true" />
                ) : (
                  <IconSun size={14} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 sm:p-5">
            <div className="flex flex-col items-start gap-3 w-fit">
              {/* Slug + change */}
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-white truncate drop-shadow">
                  {pageSlug}
                </h1>
                <button
                  type="button"
                  onClick={() => setShowChangeSlugModal(true)}
                  className="p-1.5 rounded-md text-white bg-white/20 hover:bg-white/35 border border-white/30 transition-colors"
                  title="Change slug"
                >
                  <IconPencil size={14} aria-hidden="true" />
                </button>
              </div>
              <div className="flex items-center gap-2">
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
              </div>

              {/* Row 2: Preview + Published links */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/preview/${pageSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: "link",
                    size: "sm",
                    className: "text-white/80 hover:text-white",
                  })}
                >
                  Preview
                  <IconExternalLink
                    size={13}
                    className="ml-1"
                    aria-hidden="true"
                  />
                </Link>
                {isPublished && (
                  <Link
                    href={`/${pageSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({
                      variant: "link",
                      size: "sm",
                      className: "text-white/80 hover:text-white",
                    })}
                  >
                    Published page
                    <IconExternalLink
                      size={13}
                      className="ml-1"
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </div>

              {/* Row 3: Delete */}
              <div className="flex items-center gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  disabled={isDeletingProject}
                  onClick={() => setShowDeleteProjectModal(true)}
                  className="flex items-center gap-1.5"
                >
                  <IconTrash size={14} aria-hidden="true" />
                  Delete project
                </Button>
              </div>
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
      <AddElementModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setModalPosition(null)
        }}
        onAdd={handleAddElement}
      />

      {/* Delete Element Confirmation Modal */}
      <DeleteElementModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeleteElementId(null)
        }}
        onConfirm={confirmDelete}
      />

      {/* Edit Content Modal */}
      <EditContentModal
        isOpen={!!editingElementId}
        onClose={closeEditModal}
        onSave={saveEditingContent}
        elementType={
          editingElementId !== null
            ? elements[parseInt(editingElementId, 10)]?.type
            : undefined
        }
        content={editingContent}
        onChange={setEditingContent}
      />

      {/* Edit Image Modal */}
      <EditImageModal
        isOpen={!!editingImageId}
        editingImageId={editingImageId}
        hasImage={
          editingImageId !== null
            ? !!elements[parseInt(editingImageId, 10)]?.content
            : false
        }
        onClose={closeImageEditModal}
        onFileChange={(file) => {
          if (editingImageId !== null) {
            handleImageSelect(parseInt(editingImageId, 10), file)
          }
        }}
        onRemove={handleRemoveImage}
      />

      {/* Change Slug Modal */}
      <ChangeSlugModal
        isOpen={showChangeSlugModal}
        pageSlug={pageSlug}
        pageId={pageId}
        onClose={() => setShowChangeSlugModal(false)}
        onSave={(newSlug) => {
          setPageSlug(newSlug)
          setShowChangeSlugModal(false)
        }}
      />

      {/* Upload Progress Modal */}
      <UploadProgressModal
        isOpen={progressModal.isOpen}
        progress={progressModal.progress}
      />

      {/* Element Options Modal */}
      <ElementOptionsModal
        isOpen={!!optionsElementId}
        element={
          optionsElementId !== null
            ? elements[parseInt(optionsElementId, 10)]
            : undefined
        }
        onClose={() => setOptionsElementId(null)}
        onHeadlineLevelChange={(level) => {
          if (optionsElementId !== null) {
            handleUpdateHeadlineLevel(parseInt(optionsElementId, 10), level)
          }
        }}
        onAspectRatioChange={(ratio) => {
          if (optionsElementId !== null) {
            handleUpdateAspectRatio(parseInt(optionsElementId, 10), ratio)
          }
        }}
      />

      {/* Delete Project Confirmation Modal */}
      <DeleteProjectModal
        isOpen={showDeleteProjectModal}
        pageSlug={pageSlug}
        isDeleting={isDeletingProject}
        onClose={() => setShowDeleteProjectModal(false)}
        onConfirm={handleDeleteProject}
      />

      {/* Landing Options Modal */}
      <LandingOptionsModal
        isOpen={showOptionsModal}
        pageId={pageId}
        pageSlug={pageSlug}
        elements={elements}
        pageMode={pageMode}
        onModeChange={setPageMode}
        onClose={() => setShowOptionsModal(false)}
      />
    </Container>
  )
}
