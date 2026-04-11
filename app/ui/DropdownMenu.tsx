import React, { useState } from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  trigger: React.ReactNode
  items: {
    id: string
    label: string
    onClick: () => void
    variant?: "default" | "danger"
    icon?: React.ReactNode
  }[]
  className?: string
}

const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ trigger, items, className }, ref) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div ref={ref} className={cn("relative inline-block", className)}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
        >
          {trigger}
        </button>

        {isOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 cursor-default bg-transparent"
              onClick={() => setIsOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setIsOpen(false)
              }}
              aria-label="Close menu"
            />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    item.onClick()
                    setIsOpen(false)
                  }}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-sm font-medium transition-colors flex items-center gap-2 border-b border-slate-100 last:border-b-0",
                    item.variant === "danger"
                      ? "text-red-600 hover:bg-red-50"
                      : "text-slate-700 hover:bg-slate-100",
                  )}
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    )
  },
)
DropdownMenu.displayName = "DropdownMenu"

export { DropdownMenu }
