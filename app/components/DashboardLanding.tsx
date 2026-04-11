'use client"'

import { deleteLandingPage } from "@/app/actions/pages"
import { Card, CardHeader, CardTitle } from "@/app/ui/Card"
import { Badge } from "@/app/ui/Badge"
import { CardContent } from "@/app/ui/Card"
import { Button } from "@/app/ui/Button"
import Link from "next/link"
import { useState } from "react"

export function DashboardLanding({
  landing,
  onDeleted,
  isPublished,
}: {
  landing: { id: string; slug: string }
  onDeleted: (id: string) => void
  isPublished?: boolean
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  async function handleClickDeleteLanding(id: string) {
    try {
      setIsDeleting(true)
      await deleteLandingPage(id)
      onDeleted(id)
      setShowConfirmModal(false)
    } catch (error) {
      console.error("Error deleting landing page:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card hover>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="truncate text-lg">
                <Link
                  href={`/${landing.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {landing.slug}
                </Link>
              </CardTitle>
            </div>
            <Badge variant="default" className="shrink-0">
              {isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Link href={`/builder/${landing.id}`} className="flex-1">
              <Button variant="primary" size="md" fullWidth>
                Edit
              </Button>
            </Link>
            <Link
              href={`/preview/${landing.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="secondary" size="md" fullWidth>
                Preview
              </Button>
            </Link>
            <Button
              variant="danger"
              size="md"
              disabled={isDeleting}
              onClick={() => setShowConfirmModal(true)}
              className="flex-1"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-sm mx-4">
            <CardHeader>
              <CardTitle>Delete Landing Page?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete "<strong>{landing.slug}</strong>
                "? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleClickDeleteLanding(landing.id)}
                  className="flex-1"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
