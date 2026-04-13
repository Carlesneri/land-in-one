"use server"

import { PreviewPage, PublishPage } from "@/lib/models/Page"
import { connectToDatabase } from "@/lib/mongodb"
import { deleteImageInCloud } from "@/app/actions/cloud-storage"
import type { Status } from "@/types"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { generateSlug } from "random-word-slugs"

interface SavePagePayload {
  slug: string
  elements: Array<{
    type: "text" | "image" | "headline"
    content?: string
    position: number
  }>
}

export async function getLandingPageById(id: string) {
  try {
    await connectToDatabase()

    const page = await PreviewPage.findById(id)

    if (!page) {
      return {
        success: false,
        error: "Page not found",
      }
    }

    // Convert Mongoose document to plain object to avoid serialization issues
    return {
      success: true,
      page: page.toObject(),
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

    return {
      success: true,
      page: page.toObject(),
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

export async function savePreviewPage(id: string, payload: SavePagePayload) {
  try {
    await connectToDatabase()
    const session = await getServerSession()

    if (!session?.user?.email) {
      redirect("/login")
    }

    const { slug, elements } = payload

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

export async function publishPage(id: string, payload: SavePagePayload) {
  try {
    await connectToDatabase()
    const session = await getServerSession()

    if (!session?.user?.email) {
      redirect("/login")
    }

    const { slug, elements } = payload

    if (!slug) {
      return {
        success: false,
        error: "Slug is required",
      }
    }

    // Get the preview page to capture the current updatedAt as date_version
    const previewPage = await PreviewPage.findById(id)

    if (!previewPage) {
      return {
        success: false,
        error: "Preview page not found",
      }
    }

    const modelData: Record<string, unknown> = {
      elements,
      slug,
      userEmail: session.user.email,
      date_version: previewPage.updatedAt,
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

export async function deleteLandingPage(id: string) {
  try {
    await connectToDatabase()
    const session = await getServerSession()

    if (!session?.user?.email) {
      redirect("/login")
    }

    const page = await PreviewPage.findById(id)

    if (page.userEmail !== session.user.email) {
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
