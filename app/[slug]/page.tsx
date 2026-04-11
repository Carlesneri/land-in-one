import { getPageBySlug } from "@/app/actions/pages"

export default async function PublishedLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const publishedPage = await getPageBySlug({ slug, status: "publish" })

  if (!publishedPage.success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold text-slate-900">Page not found</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold text-slate-900">
        Published Landing Page: {slug}
      </h1>
    </div>
  )
}
