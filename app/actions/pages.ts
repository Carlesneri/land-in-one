"use server"

import { PreviewPage, PublishPage } from "@/lib/models/Page"
import { connectToDatabase } from "@/lib/mongodb"
import { deleteImageInCloud } from "@/app/actions/cloud-storage"
import type { LandingPage, LandingPageElement, Status } from "@/types"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { generateSlug } from "random-word-slugs"
import { MAX_LANDING_PAGES } from "@/CONSTANTS"
import { validateSlug } from "@/lib/validation/slug"

interface SavePagePayload {
  slug: string
  mode?: "light" | "dark"
  elements: Array<
    Pick<
      LandingPageElement,
      "type" | "content" | "position" | "headlineLevel" | "aspectRatio"
    >
  >
}

export async function getPreviewLandingPageById(id: string) {
  try {
    await connectToDatabase()

    const page = await PreviewPage.findById(id)

    if (!page) {
      return {
        success: false,
        error: "Page not found",
      }
    }

    const { _id, ...restOfPage } = page.toObject()

    const mappedPage = {
      ...restOfPage,
      id: _id.toString(),
    }

    // Convert Mongoose document to plain object to avoid serialization issues
    return {
      success: true,
      page: mappedPage,
    }
  } catch (error) {
    console.error("Error fetching landing page by ID:", error)

    return {
      success: false,
      error: "Failed to fetch landing page",
    }
  }
}

export async function getPageBySlug({
  slug,
  status,
}: {
  slug: string
  status: Status
}) {
  try {
    await connectToDatabase()

    const Page = status === "publish" ? PublishPage : PreviewPage

    const page = await Page.findOne({ slug })

    if (!page) {
      return {
        success: false,
        error: "Page not found",
      }
    }

    const { _id, previewPageId, ...restOfPage } = page.toObject()

    const mappedPage = {
      ...restOfPage,
      id: _id.toString(),
      ...(previewPageId && { previewPageId: previewPageId?.toString() }),
    }

    return {
      success: true,
      page: mappedPage,
    }
  } catch (error) {
    console.error("Error fetching published page by slug:", error)

    return {
      success: false,
      error: "Failed to fetch published page",
    }
  }
}

export async function isSlugPublished(slug: string) {
  try {
    await connectToDatabase()

    const publishedPage = await PublishPage.findOne({ slug })

    return !!publishedPage
  } catch (error) {
    console.error("Error checking if slug is published:", error)
    return false
  }
}

export async function checkSlugAvailable(slug: string, currentPageId: string) {
  const validation = validateSlug(slug)
  if (!validation.valid) {
    return { available: false, error: validation.error }
  }

  try {
    await connectToDatabase()

    const existing = await PreviewPage.findOne({ slug })

    return {
      available: !existing || existing._id.toString() === currentPageId,
    }
  } catch {
    return { available: false }
  }
}

export async function savePreviewPage(id: string, payload: SavePagePayload) {
  try {
    await connectToDatabase()
    const session = await getServerSession()

    if (!session?.user?.email) {
      redirect("/login")
    }

    const { slug, elements, mode } = payload

    if (!slug) {
      return {
        success: false,
        error: "Slug is required",
      }
    }

    // Check if page exists
    const existingPage = await PreviewPage.findById(id)

    const modelData: Record<string, unknown> = {
      elements,
      slug,
      userEmail: session.user.email,
      ...(mode !== undefined && { mode }),
    }

    existingPage
      ? await PreviewPage.findByIdAndUpdate(id, modelData, {
          returnDocument: "after",
        })
      : await PreviewPage.create(modelData)

    return {
      success: true,
      message: "Page saved successfully",
    }
  } catch (error) {
    console.error("Error saving preview page:", error)

    return {
      success: false,
      error: "Failed to save preview page",
    }
  }
}

export async function publishPage(previewId: string) {
  try {
    await connectToDatabase()
    const session = await getServerSession()

    if (!session?.user?.email) {
      redirect("/login")
    }

    // Fetch the full preview document as source of truth
    const previewPage = await PreviewPage.findById(previewId)

    if (!previewPage) {
      return {
        success: false,
        error: "Preview page not found",
      }
    }

    const { slug, elements, mode } = previewPage

    if (!slug) {
      return {
        success: false,
        error: "Slug is required",
      }
    }

    const modelData: LandingPage = {
      elements,
      slug,
      mode,
      userEmail: session.user.email,
      previewPageDate: previewPage.updatedAt,
      previewPageId: previewPage._id.toString(),
    }

    // Check if a published version already exists
    const existingPublished = await PublishPage.findOne({ slug })

    existingPublished
      ? await PublishPage.findByIdAndUpdate(existingPublished._id, modelData, {
          returnDocument: "after",
        })
      : await PublishPage.create(modelData)

    return {
      success: true,
      message: "Page published successfully",
    }
  } catch (error) {
    console.error("Error publishing page:", error)

    return {
      success: false,
      error: "Failed to publish page",
    }
  }
}

export async function createNewPage() {
  try {
    await connectToDatabase()
    const session = await getServerSession()

    if (!session?.user?.email) {
      return {
        success: false,
        error: "User not authenticated",
      }
    }

    // Generate a unique slug
    const slug = generateSlug(3)

    // Check landing page limit
    const existingCount = await PreviewPage.countDocuments({
      userEmail: session.user.email,
    })
    if (existingCount >= MAX_LANDING_PAGES) {
      return {
        success: false,
        error: `You have reached the limit of ${MAX_LANDING_PAGES} landing pages.`,
      }
    }

    // Create new page with empty elements
    const newPage = await PreviewPage.create({
      slug,
      elements: [
        {
          type: "headline",
          position: 1,
        },
        {
          type: "image",
          position: 2,
        },
        {
          type: "text",
          position: 3,
        },
      ],
      userEmail: session.user.email,
    })

    return {
      success: true,
      message: "Page created successfully",
      pageId: newPage._id.toString(),
      slug: newPage.slug,
    }
  } catch (error) {
    console.error("Error creating new page:", error)

    return {
      success: false,
      error: "Failed to create new page",
    }
  }
}

export async function getUserLandings(userEmail: string) {
  try {
    await connectToDatabase()

    const pages = await PreviewPage.find({ userEmail })

    const mappedPages = pages.map((page) => ({
      id: page._id.toString(),
      slug: page.slug,
      updatedAt: page.updatedAt,
    }))

    return {
      success: true,
      pages: mappedPages,
    }
  } catch (error) {
    console.error("Error fetching user landings:", error)

    return {
      success: false,
      error: "Failed to fetch user landings",
    }
  }
}

export async function unpublishPage(slug: string) {
  try {
    await connectToDatabase()
    const session = await getServerSession()

    if (!session?.user?.email) {
      redirect("/login")
    }

    const result = await PublishPage.deleteOne({
      slug,
      userEmail: session.user.email,
    })

    if (result.deletedCount === 0) {
      return {
        success: false,
        error: "Published page not found",
      }
    }

    return {
      success: true,
      message: "Page unpublished successfully",
    }
  } catch (error) {
    console.error("Error unpublishing page:", error)

    return {
      success: false,
      error: "Failed to unpublish page",
    }
  }
}

export async function deleteLandingPage(id: string) {
  try {
    await connectToDatabase()
    const session = await getServerSession()

    if (!session?.user?.email) {
      redirect("/login")
    }

    const page = await PreviewPage.findById(id)

    if (page?.userEmail !== session.user.email) {
      return {
        success: false,
        error: "You are not authorized to delete this page",
      }
    }

    // Delete all cloud images from the page elements
    if (page?.elements && Array.isArray(page.elements)) {
      for (const element of page.elements) {
        if (element.type === "image" && element.content) {
          await deleteImageInCloud(element.content).catch(() => {
            // Silent failure for image cleanup
          })
        }
      }
    }

    if (page) {
      await PreviewPage.findByIdAndDelete(id)
    }

    if (page?.slug) {
      await PublishPage.deleteOne({
        slug: page.slug,
        userEmail: session.user.email,
      })
    }

    return {
      success: true,
      message: "Page deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting landing page:", error)

    return {
      success: false,
      error: "Failed to delete landing page",
    }
  }
}
