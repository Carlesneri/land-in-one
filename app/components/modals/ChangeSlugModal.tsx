import { Modal } from "@/app/ui/Modal"
import { validateSlug } from "@/lib/validation/slug"
import { useEffect, useState } from "react"
import { checkSlugAvailable } from "@/app/actions/pages"

interface ChangeSlugModalProps {
  isOpen: boolean
  pageSlug: string
  pageId: string
  onClose: () => void
  onSave: (newSlug: string) => void
}

export function ChangeSlugModal({
  isOpen,
  pageSlug,
  pageId,
  onClose,
  onSave,
}: ChangeSlugModalProps) {
  const [newSlugInput, setNewSlugInput] = useState("")
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [isCheckingSlug, setIsCheckingSlug] = useState(false)
  const [slugValidationError, setSlugValidationError] = useState<string | null>(
    null,
  )
  const [showConfirm, setShowConfirm] = useState(false)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setNewSlugInput(pageSlug)
      setSlugAvailable(null)
      setSlugValidationError(null)
      setShowConfirm(false)
    }
  }, [isOpen, pageSlug])

  // Debounced slug availability check
  useEffect(() => {
    if (!isOpen) return
    const trimmed = newSlugInput.trim()

    if (!trimmed || trimmed === pageSlug) {
      setSlugAvailable(null)
      setSlugValidationError(null)
      return
    }

    const validation = validateSlug(trimmed)
    if (!validation.valid) {
      setSlugValidationError(validation.error)
      setSlugAvailable(null)
      setIsCheckingSlug(false)
      return
    }

    setSlugValidationError(null)
    setIsCheckingSlug(true)
    const timer = setTimeout(() => {
      checkSlugAvailable(trimmed, pageId).then(({ available }) => {
        setSlugAvailable(available)
        setIsCheckingSlug(false)
      })
    }, 400)
    return () => clearTimeout(timer)
  }, [newSlugInput, isOpen, pageSlug, pageId])

  const handleClose = () => {
    setNewSlugInput("")
    setSlugAvailable(null)
    setSlugValidationError(null)
    setShowConfirm(false)
    onClose()
  }

  const handleSave = () => {
    const trimmed = newSlugInput.trim()
    if (!trimmed || slugAvailable === false || slugValidationError) return
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    const trimmed = newSlugInput.trim()
    onSave(trimmed)
    setNewSlugInput("")
    setSlugAvailable(null)
    setSlugValidationError(null)
    setShowConfirm(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Slug">
      {showConfirm ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800 space-y-1">
            <p className="font-semibold">Are you sure?</p>
            <p>
              The URL <span className="font-semibold">/{pageSlug}</span> will
              stop working permanently and will be replaced by{" "}
              <span className="font-semibold">/{newSlugInput.trim()}</span>.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-text font-medium rounded-lg transition-colors"
            >
              Go back
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
            >
              Yes, change it
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Enter a new slug for your page (lowercase letters, numbers and
            hyphens only).
          </p>
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2 text-xs text-yellow-800">
            ⚠️ Once you change the slug, the current URL{" "}
            <span className="font-semibold">/{pageSlug}</span> will stop working
            permanently.
          </div>
          <div className="space-y-1">
            <input
              type="text"
              value={newSlugInput}
              onChange={(e) =>
                setNewSlugInput(
                  e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                )
              }
              placeholder="my-page-slug"
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                slugValidationError || slugAvailable === false
                  ? "border-red-400 focus:border-red-500"
                  : slugAvailable === true
                    ? "border-green-400 focus:border-green-500"
                    : "border-slate-200 focus:border-primary"
              }`}
            />
            <p className="text-xs h-4">
              {isCheckingSlug && (
                <span className="text-slate-400">Checking availability…</span>
              )}
              {!isCheckingSlug && slugValidationError && (
                <span className="text-red-500">{slugValidationError}</span>
              )}
              {!isCheckingSlug &&
                !slugValidationError &&
                slugAvailable === false && (
                  <span className="text-red-500">
                    This slug is already taken.
                  </span>
                )}
              {!isCheckingSlug &&
                !slugValidationError &&
                slugAvailable === true && (
                  <span className="text-green-600">Slug is available!</span>
                )}
              {!isCheckingSlug &&
                !slugValidationError &&
                newSlugInput.trim() === pageSlug &&
                newSlugInput.trim() !== "" && (
                  <span className="text-slate-400">
                    This is the current slug.
                  </span>
                )}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-text font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={
                !newSlugInput.trim() ||
                newSlugInput.trim() === pageSlug ||
                !!slugValidationError ||
                slugAvailable === false ||
                isCheckingSlug
              }
              className="flex-1 py-2 px-4 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}
