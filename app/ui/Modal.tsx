import { cn } from "@/lib/utils"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  closeButton?: boolean
  size?: "default" | "large"
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  closeButton = true,
  size = "default",
}: ModalProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 w-screen transition-opacity duration-200",
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none",
      )}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal content */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center pointer-events-none p-4 mx-auto",
          size === "large" ? "max-w-4xl" : "max-w-100",
        )}
      >
        <div
          className={cn(
            "bg-white rounded-xl shadow-xl p-6 w-full border border-slate-200 transition-all duration-200",
            isOpen
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none",
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            {closeButton && (
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close modal"
                title="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  role="img"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
