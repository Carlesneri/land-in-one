"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AddElementButton } from "@/app/components/AddElementButton"
import { TextElement } from "@/app/components/builder/TextElement"
import { ImageElement } from "@/app/components/builder/ImageElement"
import { ImageTextElement } from "@/app/components/builder/ImageTextElement"
import { ElementCard } from "@/app/components/builder/ElementCard"
import { AddElementModal } from "@/app/components/modals/AddElementModal"
import { DeleteElementModal } from "@/app/components/modals/DeleteElementModal"
import { ChangeSlugModal } from "@/app/components/modals/ChangeSlugModal"
import { ElementOptionsModal } from "@/app/components/modals/ElementOptionsModal"
import { UploadProgressModal } from "@/app/components/modals/UploadProgressModal"
import { DeleteProjectModal } from "@/app/components/modals/DeleteProjectModal"
import { LandingModeModal } from "@/app/components/modals/LandingModeModal"
import {
  publishPage,
  savePreviewPage,
  unpublishPage,
  deleteLandingPage,
  getPageBySlug,
} from "@/app/actions/pages"
import {
  createPresignedUrl,
  deleteImageInCloud,
} from "@/app/actions/cloud-storage"
import { toast } from "sonner"
import type { LandingPageElement, AspectRatio } from "@/types"
import { MAX_IMAGE_SIZE_MB, S3_BASE_URL } from "@/CONSTANTS"
import axios, { type AxiosProgressEvent } from "axios"
import { DragDropProvider } from "@dnd-kit/react"
import { isSortableOperation } from "@dnd-kit/react/sortable"
import { Button, buttonVariants } from "@/app/ui/Button"
import { cva } from "class-variance-authority"
import {
  IconExternalLink,
  IconPencil,
  IconTrash,
  IconArrowLeft,
  IconSun,
  IconMoon,
} from "@tabler/icons-react"
import { Container } from "@/app/ui/Container"
import { cn } from "@/lib/utils"
import type { PageModelType } from "@/lib/models/Page"
import { Separator } from "@/app/ui/Separator"
const statusDotVariants = cva("w-1.5 h-1.5 rounded-full shrink-0", {
  variants: {
    status: {
      unpublished: "bg-slate-400",
      changes: "bg-yellow-300",
      upToDate: "bg-green-400",
    },
  },
})

export function AppBuilder({
  previewLandingPage,
}: {
  previewLandingPage: Omit<PageModelType, "_id"> & { id: string }
}) {
  // Ensure every element has a stable id (back-fills existing data without one)
  const normalizedLandingPage = {
    ...previewLandingPage,
    elements: previewLandingPage.elements.map((el) => ({
      ...el,
      id: el.id ?? crypto.randomUUID(),
    })),
  }

  const [previewPage, setPreviewPage] = useState<
    Omit<PageModelType, "_id"> & { id: string }
  >(normalizedLandingPage)

  // Convenience accessors derived from the single source of truth
  const elements = previewPage.elements
  const pageSlug = previewPage.slug
  const pageId = previewPage.id
  const pageMode = previewPage.mode ?? "light"

  const setElements = (
    updater:
      | LandingPageElement[]
      | ((prev: LandingPageElement[]) => LandingPageElement[]),
  ) =>
    setPreviewPage((prev) => ({
      ...prev,
      elements:
        typeof updater === "function" ? updater(prev.elements) : updater,
    }))

  const setPageSlug = (slug: string) =>
    setPreviewPage((prev) => ({ ...prev, slug }))

  const setPageMode = (mode: "light" | "dark") =>
    setPreviewPage((prev) => ({ ...prev, mode }))

  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteElementId, setDeleteElementId] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState<boolean | undefined>()
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
  const hasMounted = useRef(false)
  const router = useRouter()
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false)
  const [isDeletingProject, setIsDeletingProject] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const [publishedPage, setPublishedPage] = useState<
    (Omit<PageModelType, "_id"> & { id: string }) | null
  >(null)
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false)

  // Fetch the published version on mount to determine initial status
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally runs once on mount
  useEffect(() => {
    getPageBySlug({ slug: pageSlug, status: "publish" }).then((result) => {
      if (result?.success && result.page) {
        const page = result.page
        setPublishedPage(page)
        setIsPublished(true)
      } else {
        setIsPublished(false)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Derive hasUnpublishedChanges from timestamps when publishedPage is loaded/updated
  useEffect(() => {
    if (!publishedPage) return
    if (new Date(previewPage.updatedAt) > new Date(publishedPage.updatedAt)) {
      setHasUnpublishedChanges(true)
    }
  }, [publishedPage, previewPage.updatedAt])
  const [bottomMessageStatus, setBottomMessageStatus] = useState<
    "unpublished" | "changes" | "upToDate"
  >()
  const [bottomMessage, setBottomMessage] = useState<string>("")

  // Update bottom bar message when publish state or changes flag updates
  useEffect(() => {
    if (!isPublished) {
      setBottomMessageStatus("unpublished")
      setBottomMessage("Not published")
    } else if (hasUnpublishedChanges) {
      setBottomMessageStatus("changes")
      setBottomMessage("You have unpublished changes")
    } else {
      setBottomMessageStatus("upToDate")
      setBottomMessage("Published · up to date")
    }
  }, [isPublished, hasUnpublishedChanges])

  // Auto-save elements to Preview Page model when they change
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }

    setHasUnpublishedChanges(true)

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

  const handleDragSort = (sourceIndex: number, targetIndex: number) => {
    const newElements = [...elements]
    const draggedEl = newElements[sourceIndex]
    newElements.splice(sourceIndex, 1)
    newElements.splice(targetIndex, 0, draggedEl)
    newElements.forEach((el, idx) => {
      el.position = idx
    })
    setElements(newElements)
  }

  const handleAddElement = (type: "text" | "image" | "image-text") => {
    if (
      (type === "image" || type === "image-text") &&
      elements.filter((el) => el.type === "image" || el.type === "image-text")
        .length >= 10
    ) {
      setShowModal(false)
      toast.error("You can only add up to 10 image elements per page")
      return
    }

    const base = { id: crypto.randomUUID(), position: elements.length }
    const newElement: LandingPageElement =
      type === "text"
        ? { ...base, type: "text", content: "" }
        : type === "image"
          ? { ...base, type: "image", content: "" }
          : { ...base, type: "image-text", image: "", text: "" }

    setElements((prev) => [...prev, newElement])
    setShowModal(false)
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
      if (element?.type === "image" && element.content) {
        deleteImageInCloud(element.content).catch(() => {
          // Silent failure for cleanup
        })
      }
      if (element?.type === "image-text" && element.image) {
        deleteImageInCloud(element.image).catch(() => {
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
      elements.map((el, idx) => {
        if (idx !== index) return el
        if (el.type === "text") return { ...el, content }
        if (el.type === "image") return { ...el, content }
        return { ...el, image: content } // image-text: content holds the image URL
      }),
    )
  }

  const handleUpdateAspectRatio = (
    index: number,
    ratio: AspectRatio | undefined,
  ) => {
    setElements(
      elements.map((el, idx) =>
        idx === index && (el.type === "image" || el.type === "image-text")
          ? { ...el, aspectRatio: ratio }
          : el,
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
    const el = elements[index]
    const currentImageUrl =
      el?.type === "image-text"
        ? el.image
        : el?.type === "image"
          ? el.content
          : undefined

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
      const result = await publishPage(pageId)

      if (result?.success) {
        toast.success("Page published successfully")
        setIsPublished(true)
        setHasUnpublishedChanges(false)
        // Fetch and store the newly published page
        getPageBySlug({ slug: pageSlug, status: "publish" }).then((r) => {
          if (r?.success && r.page) setPublishedPage(r.page)
        })
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
            <div className="flex flex-col items-start gap-3 w-full">
              {/* Row 2: Preview + Published links */}
              <div className="flex items-center gap-3 flex-wrap w-full">
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

              <Separator className="bg-slate-400" />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!hasUnpublishedChanges && isPublished) {
                      toast.info(
                        "You already have the latest changes published",
                      )
                      return
                    }
                    handlePublishPage()
                  }}
                  disabled={isPublishing || isPublished === undefined}
                  className={cn(
                    "flex items-center px-4 py-1.5 font-semibold rounded-lg transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-60",
                    !hasUnpublishedChanges && isPublished
                      ? "bg-white/40 text-primary/60 cursor-not-allowed"
                      : "bg-success hover:bg-success-hover text-white",
                  )}
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

          {/* Bottom bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-black/15 border-t border-white/15">
            {bottomMessageStatus && (
              <span
                className={statusDotVariants({ status: bottomMessageStatus })}
              />
            )}
            {bottomMessage && (
              <span className="text-xs text-white/70">{bottomMessage}</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8">
          {/* Preview Area */}
          <DragDropProvider
            onDragEnd={(event) => {
              if (event.canceled) return
              const { operation } = event
              if (!isSortableOperation(operation)) return
              const sourceIndex = operation.source?.index
              const targetIndex = operation.target?.index
              if (sourceIndex == null || targetIndex == null) return
              if (sourceIndex !== targetIndex) {
                handleDragSort(sourceIndex, targetIndex)
              }
            }}
          >
            <div className="space-y-6">
              {elements.map((element, index) => (
                <ElementCard
                  key={element.id}
                  element={element}
                  index={index}
                  onDelete={handleDeleteElement}
                  onOpenOptions={(i) => setOptionsElementId(String(i))}
                >
                  {element.type === "text" && (
                    <TextElement
                      element={element}
                      onSave={(content) => handleUpdateContent(index, content)}
                    />
                  )}
                  {element.type === "image" && (
                    <ImageElement
                      element={element}
                      index={index}
                      onFileChange={(file) => handleImageSelect(index, file)}
                      onRemove={() => {
                        const url = element.content
                        if (url) deleteImageInCloud(url).catch(() => {})
                        handleUpdateContent(index, "")
                        toast.success("Image removed")
                      }}
                    />
                  )}
                  {element.type === "image-text" && (
                    <ImageTextElement
                      element={element}
                      onFileChange={(file) => handleImageSelect(index, file)}
                      onImageRemove={() => {
                        const url = element.image
                        if (url) deleteImageInCloud(url).catch(() => {})
                        setElements(
                          elements.map((el, idx) =>
                            idx === index && el.type === "image-text"
                              ? { ...el, image: "" }
                              : el,
                          ),
                        )
                      }}
                      onSave={(image, text) =>
                        setElements(
                          elements.map((el, idx) =>
                            idx === index && el.type === "image-text"
                              ? { ...el, image, text }
                              : el,
                          ),
                        )
                      }
                    />
                  )}
                </ElementCard>
              ))}
            </div>
          </DragDropProvider>

          <AddElementButton
            className="mt-6"
            onClick={() => setShowModal(true)}
          />
        </div>
      </section>

      {/* Add Element Modal */}
      <AddElementModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
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
      <LandingModeModal
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
