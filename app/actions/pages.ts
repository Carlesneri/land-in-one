"use server"

import { PreviewPage, PublishPage } from "@/lib/models/Page"
import { connectToDatabase } from "@/lib/mongodb"
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
  status: Status
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

export async function savePageElements(id: string, payload: SavePagePayload) {
  try {
    await connectToDatabase()
    const session = await getServerSession()

    if (!session?.user?.email) {
      redirect("/login")
    }

    const { slug, elements, status } = payload

    if (!slug) {
      return {
        success: false,
        error: "Slug is required",
      }
    }

    // Get the appropriate model based on status
    const PageModel = status === "publish" ? PublishPage : PreviewPage

    // Check if page exists
    const existingPage = await PageModel.findById(id)

    const modelData = {
      elements,
      slug,
    }

    existingPage
      ? await PageModel.findByIdAndUpdate(id, modelData, { new: true })
      : await PageModel.create(modelData)

    return {
      success: true,
      message: `Page ${status === "publish" ? "published" : "saved"} successfully`,
    }
  } catch (error) {
    console.error("Error saving page elements:", error)

    return {
      success: false,
      error: "Failed to save page elements",
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
