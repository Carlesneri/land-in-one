import { getLandingPageById } from "@/app/actions/pages"
import { AppBuilder } from "@/app/components/AppBuilder"

export default async function BuilderIdPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const landingDoc = await getLandingPageById(id)

  if (!id || !landingDoc?.page) {
    // Add button for creating new page
    return <h1>No Landing Page Found</h1>
  }

  return (
    <AppBuilder
      elements={landingDoc.page.elements}
      slug={landingDoc.page.slug}
      id={id}
    />
  )
}
