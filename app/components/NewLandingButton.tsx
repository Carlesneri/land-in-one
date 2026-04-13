"use client"

import { createNewPage } from "@/app/actions/pages"
import { Button } from "@/app/ui/Button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function NewLandingButton() {
  const router = useRouter()
  const { data: session } = useSession()

  async function onCreateNewProject() {
    if (!session?.user) {
      router.push("/login")
      return
    }

    try {
      const result = await createNewPage()

      if (result.success && result.pageId) {
        router.push(`/builder/${result.pageId}`)
      } else {
        console.error("Failed to create new page")
      }
    } catch {
      console.error("Error creating new project")
    }
  }

  return (
    <Button
      type="button"
      onClick={onCreateNewProject}
      variant="primary"
      size="lg"
    >
      New Project
    </Button>
  )
}
