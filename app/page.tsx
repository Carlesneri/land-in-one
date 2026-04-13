import { Container } from "@/app/ui/Container"
import { Button } from "@/app/ui/Button"
import Link from "next/link"
import { HeaderFooterLayout } from "@/app/components/HeaderFooterLayout"
import { getServerSession } from "next-auth"
import { NewLandingButton } from "@/app/components/NewLandingButton"

export default async function Home() {
  const session = await getServerSession()

  return (
    <HeaderFooterLayout>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="flex items-center justify-center px-4">
          <Container>
            <div className="text-center max-w-3xl mx-auto animate-in fade-in duration-500">
              {/* Main Heading */}
              <div className="mt-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                  Create Landing Pages in
                  <span className="block bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    Less Than a Minute
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
                  Build beautiful, responsive landing pages without any coding.
                  Drag, drop, and publish. It's that simple.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <NewLandingButton />
                {session?.user && (
                  <Link href="/dashboard">
                    <Button variant="outline" size="lg">
                      View Dashboard
                    </Button>
                  </Link>
                )}
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
                <div className="space-y-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Lightning Fast
                  </h3>
                  <p className="text-sm text-slate-600">
                    Create and launch in minutes, not days
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Fully Responsive
                  </h3>
                  <p className="text-sm text-slate-600">
                    Perfect on all devices, automatically
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 text-purple-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Easy to Use
                  </h3>
                  <p className="text-sm text-slate-600">
                    No technical skills required
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </HeaderFooterLayout>
  )
}
