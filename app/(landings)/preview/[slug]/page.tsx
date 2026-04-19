import { getPageBySlug } from "@/app/actions/pages"
import { LandingPage } from "@/app/components/LandingPage"
import { getServerSession } from "next-auth"
import Link from "next/link"

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await getServerSession()

  const previewPage = await getPageBySlug({ slug, status: "preview" })

  if (!previewPage.success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold text-slate-900">Page not found</h1>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link
          href="/login"
          className="mt-4 text-blue-600 hover:text-blue-800 underline"
        >
          Go to login
        </Link>
      </div>
    )
  }

  if (session?.user?.email !== previewPage.page?.userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold text-slate-900">Unauthorized</h1>
      </div>
    )
  }

  return (
    <LandingPage
      elements={previewPage.page?.elements || []}
      slug={slug}
      status="preview"
      id={previewPage.page?._id.toString() || ""}
      mode={previewPage.page?.mode ?? "light"}
    />
  )
}
