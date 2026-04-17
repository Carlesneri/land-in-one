import { Container } from "@/app/ui/Container"
import { Button } from "@/app/ui/Button"
import Link from "next/link"
import { HeaderFooterLayout } from "@/app/components/HeaderFooterLayout"
import { getServerSession } from "next-auth"
import { NewLandingButton } from "@/app/components/NewLandingButton"
import { IconBolt, IconDeviceDesktop, IconRocket } from "@tabler/icons-react"

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
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#111827] leading-tight">
                  Create Landing Pages in
                  <span className="block text-[#6442D6]">
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
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#EDE9FB] text-[#6442D6]">
                    <IconBolt size={24} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#111827]">
                    Lightning Fast
                  </h3>
                  <p className="text-sm text-slate-600">
                    Create and launch in minutes, not days
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#EDE9FB] text-[#6442D6]">
                    <IconDeviceDesktop size={24} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#111827]">
                    Fully Responsive
                  </h3>
                  <p className="text-sm text-slate-600">
                    Perfect on all devices, automatically
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#EDE9FB] text-[#6442D6]">
                    <IconRocket size={24} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#111827]">
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
