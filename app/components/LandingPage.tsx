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
    sortedElements.length === 0 || sortedElements.every((el) => !el.content)

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
                <div
                  key={`${element.type}-${element.position}`}
                  className="w-full"
                >
                  {element.type === "headline" &&
                    (() => {
                      const level = element.headlineLevel ?? 1
                      const sizeClasses: Record<number, string> = {
                        1: "text-4xl md:text-5xl",
                        2: "text-3xl md:text-4xl",
                        3: "text-2xl md:text-3xl",
                        4: "text-xl md:text-2xl",
                        5: "text-lg md:text-xl",
                        6: "text-base md:text-lg",
                      }
                      const cls = `${sizeClasses[level]} font-bold`
                      if (level === 1)
                        return <h1 className={cls}>{element.content}</h1>
                      if (level === 2)
                        return <h2 className={cls}>{element.content}</h2>
                      if (level === 3)
                        return <h3 className={cls}>{element.content}</h3>
                      if (level === 4)
                        return <h4 className={cls}>{element.content}</h4>
                      if (level === 5)
                        return <h5 className={cls}>{element.content}</h5>
                      return <h6 className={cls}>{element.content}</h6>
                    })()}

                  {element.type === "text" && (
                    <div
                      className="text-lg leading-relaxed prose prose-slate max-w-none"
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
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
