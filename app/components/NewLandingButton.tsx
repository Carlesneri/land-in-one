"use client"

import { createNewPage } from "@/app/actions/pages"
import { Button } from "@/app/ui/Button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { IconPlus } from "@tabler/icons-react"
import { toast } from "sonner"

export function NewLandingButton({
  showIcon = true,
  variant = "primary",
}: {
  showIcon?: boolean
  variant?: "primary" | "link"
}) {
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
      } else if (result.error) {
        toast.info(result.error)
      } else {
        toast.error("Failed to create new page")
      }
    } catch {
      toast.error("Something went wrong creating the project")
    }
  }

  return (
    <Button
      type="button"
      onClick={onCreateNewProject}
      variant={variant}
      size="lg"
      className="flex items-center gap-2"
    >
      {showIcon && <IconPlus size={20} aria-hidden="true" />}
      New Project
    </Button>
  )
}
