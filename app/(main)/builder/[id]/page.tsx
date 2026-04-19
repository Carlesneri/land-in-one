import { getPreviewLandingPageById } from "@/app/actions/pages"
import { AppBuilder } from "@/app/components/AppBuilder"

export default async function BuilderIdPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const previewLandingPage = await getPreviewLandingPageById(id)

  if (!id || !previewLandingPage?.page) {
    // Add button for creating new page
    return <h1>No Landing Page Found</h1>
  }

  return <AppBuilder previewLandingPage={previewLandingPage.page} />
}
