"use client"

import { useState } from "react"
import { Empty } from "@/app/ui/Empty"
import { NewLandingButton } from "@/app/components/NewLandingButton"
import { DashboardLanding } from "@/app/components/DashboardLanding"

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
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Dashboard
          </h1>
          <p className="text-slate-600 mt-2">
            Manage and edit your landing pages
          </p>
        </div>
        <NewLandingButton />
      </div>

      {visiblePages.length === 0 ? (
        <Empty
          icon={
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
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
