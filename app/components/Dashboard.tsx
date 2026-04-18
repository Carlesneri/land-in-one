"use client"

import { useState } from "react"
import { Empty } from "@/app/ui/Empty"
import { NewLandingButton } from "@/app/components/NewLandingButton"
import { DashboardLanding } from "@/app/components/DashboardLanding"
import { IconFileDescription } from "@tabler/icons-react"

export function Dashboard({
  pages,
}: {
  pages: { id: string; slug: string }[]
}) {
  const [deletedPages, setDeletedPages] = useState<string[]>([])

  const visiblePages = pages.filter((p) => !deletedPages.includes(p.id))

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#111827]">
            Dashboard
          </h1>
          <p className="text-slate-600 mt-2">
            Manage and edit your landing pages
          </p>
        </div>
        <NewLandingButton showIcon={false} />
      </div>

      {visiblePages.length === 0 ? (
        <Empty
          icon={
            <IconFileDescription
              size={48}
              className="text-[#C8B3FD]"
              aria-hidden="true"
            />
          }
          title="No landing pages yet"
          description="Create your first landing page to get started"
          action={<NewLandingButton />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visiblePages.map((landing) => (
            <DashboardLanding
              key={landing.id}
              landing={landing}
              onDeleted={(id) => setDeletedPages((prev) => [...prev, id])}
            />
          ))}
        </div>
      )}
    </div>
  )
}
