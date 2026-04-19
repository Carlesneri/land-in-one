import { getPreviewLandingPageById } from "@/app/actions/pages"
import { AppBuilder } from "@/app/components/AppBuilder"
import { notFound } from "next/navigation"

export default async function BuilderIdPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const previewLandingPage = await getPreviewLandingPageById(id)

  if (!previewLandingPage?.page) {
    return notFound()
  }

  return <AppBuilder previewLandingPage={previewLandingPage.page} />
}
