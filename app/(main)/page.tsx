import { Container } from "@/app/ui/Container"
import { Button } from "@/app/ui/Button"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { NewLandingButton } from "@/app/components/NewLandingButton"
import {
  IconBolt,
  IconDeviceDesktop,
  IconRocket,
  IconSparkles,
} from "@tabler/icons-react"
import Image from "next/image"

export default async function Home() {
  const session = await getServerSession()

  return (
    <Container>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="relative text-center max-w-3xl mx-auto py-12 sm:py-24">
          <h1 className="bg-linear-to-r from-primary via-warning to-success bg-clip-text text-transparent font-black text-4xl md:text-6xl text-center mb-4 tracking-tight w-fit mx-auto">
            Land In One
          </h1>
          <Image
            src="/logo.png"
            alt="Land In One logo"
            width={64}
            height={64}
            className="mx-auto mb-6"
          />
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary text-primary text-sm font-medium mb-8">
            <IconSparkles size={14} aria-hidden="true" />
            No-code landing pages
          </div>

          <h2 className="text-3xl md:text-5xl font-semibold text-text leading-[1.1] mb-6 tracking-tight">
            Create Landing Pages
            <br />
            <span className="bg-linear-to-r from-primary via-warning to-success bg-clip-text text-transparent">
              in Less Than a Minute
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Drag, drop, publish — beautiful responsive pages without writing a
            single line of code.
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

        {/* Gradient fade into features section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-slate-50 to-transparent pointer-events-none" />
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-primary mb-10">
          Why Land In One?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Card 1 — Warning / Amber accent */}
          <div className="relative squircle-2xl bg-warning p-7 shadow-lg overflow-hidden">
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-warning-light-hover/30 blur-2xl pointer-events-none" />
            <div className="inline-flex items-center justify-center w-12 h-12 squircle-lg bg-white/20 text-white mb-5">
              <IconBolt size={24} aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Lightning Fast
            </h3>
            <p className="text-sm text-warning-light leading-relaxed">
              Create and launch in minutes, not days
            </p>
          </div>

          {/* Card 2 — Primary / Purple accent */}
          <div className="relative squircle-2xl bg-primary p-7 shadow-lg overflow-hidden">
            <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-secondary/35 blur-2xl pointer-events-none" />
            <div className="inline-flex items-center justify-center w-12 h-12 squircle-lg bg-white/15 text-white mb-5">
              <IconDeviceDesktop size={24} aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Fully Responsive
            </h3>
            <p className="text-sm text-secondary leading-relaxed">
              Perfect on all devices, automatically
            </p>
          </div>

          {/* Card 3 — Success / Green accent */}
          <div className="relative squircle-2xl bg-success p-7 shadow-lg overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-success-soft/30 blur-2xl pointer-events-none" />
            <div className="inline-flex items-center justify-center w-12 h-12 squircle-lg bg-white/20 text-white mb-5">
              <IconRocket size={24} aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Easy to Use</h3>
            <p className="text-sm text-success-light leading-relaxed">
              No technical skills required
            </p>
          </div>
        </div>
      </section>
    </Container>
  )
}
