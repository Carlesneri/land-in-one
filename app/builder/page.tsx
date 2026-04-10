"use client"

import { createNewPage } from "@/app/actions/pages"
import { useRouter } from "next/navigation"

export default function BuilderPage() {
  const router = useRouter()

  async function onCreateNewProject() {
    try {
      const result = await createNewPage()

      if (result.success && result.pageId) {
        router.push(`/builder/${result.pageId}`)
      } else {
        console.error("Failed to create new page:", result.error)
      }
    } catch (error) {
      console.error("Error creating new project:", error)
    }
  }

  return (
    <button type="button" onClick={onCreateNewProject}>
      New Project
    </button>
  )
}
