import type { LandingPageElement, Status } from "@/types"
import Link from "next/link"
import Image from "next/image"
import { cva } from "class-variance-authority"

const landingVariants = cva("min-h-screen flex flex-col", {
  variants: {
    mode: {
      light: "landing-light",
      dark: "landing-dark",
    },
  },
  defaultVariants: {
    mode: "light",
  },
})

interface PageViewProps {
  elements: LandingPageElement[]
  slug: string
  status: Status
  id: string
  mode?: "light" | "dark"
}

export function LandingPage({
  elements,
  slug,
  status,
  id,
  mode = "light",
}: PageViewProps) {
  // Sort elements by position
  const sortedElements = [...elements].sort((a, b) => a.position - b.position)

  const noContent =
    sortedElements.length === 0 ||
    sortedElements.every((el) =>
      el.type === "image-text" ? !el.image && !el.text : !el.content,
    )

  return (
    <div className={landingVariants({ mode })}>
      {/* Preview Banner */}
      {status === "preview" && (
        <div className="w-full bg-yellow-50 border-b-2 border-yellow-300 px-4 py-4">
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

      {/* Page content */}
      <div className="flex-1" style={{ backgroundColor: "var(--lp-bg)" }}>
        {noContent ? (
          <div className="max-w-4xl mx-auto px-4 py-8 flex items-center justify-center min-h-full">
            <p className="text-lg" style={{ color: "var(--lp-text-muted)" }}>
              No content yet
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4 pt-8 pb-24 landing-content">
            <div className="space-y-8">
              {sortedElements.map((element) => (
                <div key={element.id} className="w-full">
                  {element.type === "text" && (
                    <div
                      className="rich-text-lio text-lg leading-relaxed prose prose-slate max-w-none"
                      // biome-ignore lint/security/noDangerouslySetInnerHtml: content is user-authored rich text from Tiptap
                      dangerouslySetInnerHTML={{
                        __html: element.content ?? "",
                      }}
                    />
                  )}

                  {element.type === "image" && element.content && (
                    <div
                      className="w-full relative overflow-hidden rounded-lg"
                      style={
                        element.aspectRatio
                          ? { aspectRatio: element.aspectRatio }
                          : undefined
                      }
                    >
                      <Image
                        src={element.content}
                        alt={`Page image element at position ${element.position}`}
                        className={
                          element.aspectRatio
                            ? "w-full h-full object-cover"
                            : "w-full h-auto"
                        }
                        width={800}
                        height={600}
                      />
                    </div>
                  )}

                  {element.type === "image-text" && element.image && (
                    <div className="w-full relative overflow-hidden rounded-lg">
                      <Image
                        src={element.image}
                        alt={`Page image-text element at position ${element.position}`}
                        className="w-full h-auto"
                        width={800}
                        height={600}
                      />
                      {element.text && (
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                          {/* Linear gradient scrim for readability */}
                          <span
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background:
                                "linear-gradient(to bottom, transparent, rgba(0,0,0,0.6) 50%, transparent)",
                            }}
                            aria-hidden="true"
                          />
                          <div
                            className="rich-text-lio relative text-white text-center drop-shadow-lg prose prose-invert w-full"
                            // biome-ignore lint/security/noDangerouslySetInnerHtml: content is user-authored rich text from Tiptap
                            dangerouslySetInnerHTML={{ __html: element.text }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
