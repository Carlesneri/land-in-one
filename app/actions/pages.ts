"use server"

// import { connectToDatabase } from '@/lib/mongodb'
import { PreviewPage, PublishPage } from "@/lib/models/Page"
import { connectToDatabase } from "@/lib/mongodb"

interface SavePagePayload {
  slug: string
  elements: Array<{
    id: string
    type: "text" | "image" | "headline"
    content?: string
  }>
  status: "preview" | "publish"
}

export async function savePageElements(payload: SavePagePayload) {
  try {
    await connectToDatabase()

    const { slug, elements, status } = payload

    if (!slug) {
      return {
        success: false,
        error: "Slug is required",
      }
    }

    // Convert elements to include position based on array index
    const elementsWithPosition = elements.map((element, index) => ({
      type: element.type,
      content: element.content || "",
      position: index,
    }))

    // Get the appropriate model based on status
    const PageModel = status === "publish" ? PublishPage : PreviewPage

    // Check if page exists
    const existingPage = await PageModel.findOne({ slug })

    let page

    if (existingPage) {
      // Update existing page
      page = await PageModel.findOneAndUpdate(
        { slug },
        {
          elements: elementsWithPosition,
        },
        { new: true },
      )
    } else {
      // Create new page
      page = await PageModel.create({
        slug,
        elements: elementsWithPosition,
      })
    }

    return {
      success: true,
      data: page,
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
