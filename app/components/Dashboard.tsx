"use client"

import { deleteLandingPage } from "@/app/actions/pages"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"

export function Dashboard({
  pages,
}: {
  pages: { id: string; slug: string }[]
}) {
  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {pages?.map((landing) => (
          <DashboardLanding key={landing.id} landing={landing} />
        ))}
      </ul>
    </div>
  )
}

function DashboardLanding({
  landing,
}: {
  landing: { id: string; slug: string }
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)

  async function handleClickDeleteLanding(id: string) {
    try {
      setIsDeleting(true)

      await deleteLandingPage(id)

      setIsDeleted(true)
    } catch {
      console.error("Error deleting landing page")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <li
      key={landing.id}
      className={cn(
        "flex gap-2 justify-between items-center",
        isDeleted ? "hidden" : "",
      )}
    >
      <Link href={`/builder/${landing.id}`}>{landing.slug}</Link>
      <button
        disabled={isDeleting}
        type="button"
        onClick={() => handleClickDeleteLanding(landing.id)}
      >
        Delete
      </button>
    </li>
  )
}
