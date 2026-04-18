import { Container } from "@/app/ui/Container"
import { Button } from "@/app/ui/Button"
import Link from "next/link"
import { HeaderFooterLayout } from "@/app/components/HeaderFooterLayout"
import { getServerSession } from "next-auth"
import { NewLandingButton } from "@/app/components/NewLandingButton"
import {
  IconBolt,
  IconDeviceDesktop,
  IconRocket,
  IconSparkles,
} from "@tabler/icons-react"

export default async function Home() {
  const session = await getServerSession()

  return (
    <HeaderFooterLayout>
      <div className="flex flex-col">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <Container>
            <div className="relative text-center max-w-3xl mx-auto py-24 sm:py-32">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C8B3FD] text-[#6442D6] text-sm font-medium mb-8">
                <IconSparkles size={14} aria-hidden="true" />
                No-code landing pages
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-[#111827] leading-[1.1] mb-6 tracking-tight">
                Create Landing Pages
                <br />
                <span className="bg-linear-to-r from-[#6442D6] via-[#D97706] to-[#16A34A] bg-clip-text text-transparent">
                  in Less Than a Minute
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
                Drag, drop, publish — beautiful responsive pages without writing
                a single line of code.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <NewLandingButton />
                {session?.user && (
                  <Link href="/dashboard">
                    <Button variant="outline" size="lg">
                      View Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Container>

          {/* Gradient fade into features section */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-slate-50 to-transparent pointer-events-none" />
        </section>

        {/* ── Features ─────────────────────────────────────────── */}
        <section className="py-16 sm:py-20">
          <Container>
            <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-[#6442D6] mb-10">
              Why Land In One?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Card 1 — Warning / Amber accent */}
              <div className="relative squircle-2xl bg-[#D97706] p-7 shadow-lg overflow-hidden">
                <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#FCD34D]/30 blur-2xl pointer-events-none" />
                <div className="inline-flex items-center justify-center w-12 h-12 squircle-lg bg-white/20 text-white mb-5">
                  <IconBolt size={24} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Lightning Fast
                </h3>
                <p className="text-sm text-[#FEF3C7] leading-relaxed">
                  Create and launch in minutes, not days
                </p>
              </div>

              {/* Card 2 — Primary / Purple accent */}
              <div className="relative squircle-2xl bg-[#6442D6] p-7 shadow-lg overflow-hidden">
                <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-[#C8B3FD]/35 blur-2xl pointer-events-none" />
                <div className="inline-flex items-center justify-center w-12 h-12 squircle-lg bg-white/15 text-white mb-5">
                  <IconDeviceDesktop size={24} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Fully Responsive
                </h3>
                <p className="text-sm text-[#C8B3FD] leading-relaxed">
                  Perfect on all devices, automatically
                </p>
              </div>

              {/* Card 3 — Success / Green accent */}
              <div className="relative squircle-2xl bg-[#16A34A] p-7 shadow-lg overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#86EFAC]/30 blur-2xl pointer-events-none" />
                <div className="inline-flex items-center justify-center w-12 h-12 squircle-lg bg-white/20 text-white mb-5">
                  <IconRocket size={24} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Easy to Use
                </h3>
                <p className="text-sm text-[#DCFCE7] leading-relaxed">
                  No technical skills required
                </p>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </HeaderFooterLayout>
  )
}
