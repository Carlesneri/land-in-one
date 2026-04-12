"use client"

import { createNewPage } from "@/app/actions/pages"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/app/ui/Button"
import { AuthProvider } from "@/app/providers/AuthProvider"

export function NewLandingButton() {
  return (
    <AuthProvider>
      <ProvidedNewLandingButton />
    </AuthProvider>
  )
}

function ProvidedNewLandingButton() {
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
        console.error("Failed to create new page:", result.error)
      }
    } catch (error) {
      console.error("Error creating new project:", error)
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
