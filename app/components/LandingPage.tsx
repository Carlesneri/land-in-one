import type { LandingPageElement, Status } from "@/types"
import Link from "next/link"
import Image from "next/image"

interface PageViewProps {
  elements: LandingPageElement[]
  slug: string
  status: Status
  id: string
}

export function LandingPage({ elements, slug, status, id }: PageViewProps) {
  // Sort elements by position
  const sortedElements = [...elements].sort((a, b) => a.position - b.position)

  const noContent =
    sortedElements.length === 0 || sortedElements.every((el) => !el.content)

  return (
    <>
      {noContent ? (
        <div className="min-h-screen bg-white">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <p className="text-slate-500 text-lg">No content yet</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-white">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {sortedElements.length === 0 ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-slate-500 text-lg">No content yet</p>
              </div>
            ) : (
              <div className="space-y-8">
                {sortedElements.map((element) => (
                  <div
                    key={`${element.type}-${element.position}`}
                    className="w-full"
                  >
                    {element.type === "headline" && (
                      <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                        {element.content}
                      </h1>
                    )}

                    {element.type === "text" && (
                      <p className="text-lg text-slate-700 leading-relaxed">
                        {element.content}
                      </p>
                    )}

                    {element.type === "image" && element.content && (
                      <div className="w-full max-h-100 aspect-video bg-slate-100 rounded-lg overflow-hidden relative">
                        <Image
                          src={element.content}
                          alt={`Page image element at position ${element.position}`}
                          className="object-cover size-full"
                          width={800}
                          height={600}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Preview Banner */}
      {status === "preview" && (
        <div className="fixed bottom-0 left-0 right-0 bg-yellow-50 border-t-2 border-yellow-300 px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-yellow-900">
              This is a preview page
            </span>
            <div className="flex gap-3">
              <Link
                href={`/${slug}`}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
              >
                View Published Page
              </Link>
              <Link
                href={`/builder/${id}`}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
              >
                Go to the project builder
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
